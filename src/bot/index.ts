import { Bot as TelegramBot, session } from "grammy";
import { EventBuilder } from "./models/event-builder.js";
import { EventContext } from "./event-context.js";
import { checkIfAdmin, checkIfGroup, checkIfPrivate, getSessionKey } from "./middlewares.js";

import { autoRetry } from "@grammyjs/auto-retry";
import { stepHandler } from "./handlers/index.js";


export function createBot(token: string) {
    const bot = new TelegramBot<EventContext>(token);

    // Set the session middleware and initialize session data
    bot.use(session({ getSessionKey, initial: () => ({ builder: new EventBuilder() }) }));

    /// Set the auto-retry middleware
    bot.api.config.use(autoRetry());

    bot.command('hike', checkIfGroup, checkIfAdmin, async (ctx) => {
        const message = await ctx.reply('Benvenuto nel bot di escursionismo di @relaps_hiking!', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: 'Crea il tuo evento!', url: `https://t.me/relaps_bot?start=${ctx.chat.id}` }]
                ]
            }
        });

        setTimeout(async () => {
            try {
                await ctx.deleteMessage();
                await ctx.api.deleteMessage(ctx.chat.id, message.message_id);
            } catch (error) {
                console.error(error);
            }
        }, 10000);
    });

    bot.command('start', checkIfPrivate, async (ctx) => {
        ctx.session.groupId = parseInt(ctx.match) || ctx.session.groupId;
        
        if (!ctx.session.groupId) {
            await ctx.reply('Per utilizzare il bot, invia il comando /hike da una chat di gruppo.');
            return;
        }

        const chat = await bot.api.getChat(ctx.session.groupId);
        if (chat.type != "supergroup") {
            await ctx.reply(`Ti aiuterò a creare il tuo evento di escursionismo.`);
        } else {
            await ctx.reply(`Stai per creare un evento per il gruppo @${chat.username}.`);
        }

        await ctx.reply('Inserisci il nome dell\'evento (es., Giro ad anello Monte Rosa):')
    });

    bot.callbackQuery('publish', async (ctx) => {
        const chatId = ctx.session.groupId;
        const builder = ctx.session.builder;
        const script = builder.formatEvent();
        const photoId = builder.getPhotoId();

        if (photoId) {
            const message = await ctx.api.sendPhoto(chatId, photoId, { caption: script, parse_mode: 'MarkdownV2' });

            try {
                await ctx.api.pinChatMessage(message.chat.id, message.message_id, { disable_notification: true });
            } catch (e) {
                await ctx.reply('Impossibile pinnare il messaggio, il bot deve essere un amministratore!');
            }
        } else {
            const message = await ctx.api.sendMessage(chatId, script, { parse_mode: 'MarkdownV2', link_preview_options: { is_disabled: true } });

            try {
                await ctx.api.pinChatMessage(message.chat.id, message.message_id, { disable_notification: true });
            } catch (e) {
                await ctx.reply('Impossibile pinnare il messaggio, il bot deve essere un amministratore!');
            }
        }

        const poll = await ctx.api.sendPoll(
            chatId,
            builder.getFullTitle(),
            ['Ci sono 🧗‍♂️', 'Non ci sono 😥', 'Ho bisogno di un passaggio 🛒'],
            {
                is_anonymous: false,
                allows_multiple_answers: true
            }
        )

        try {
            await ctx.api.pinChatMessage(poll.chat.id, poll.message_id, { disable_notification: true });
        } catch (e) {
            await ctx.reply('Impossibile pinnare il messaggio, il bot deve essere un amministratore!');
        }

        const chat = await bot.api.getChat(ctx.session.groupId);
        if (chat.type != "supergroup") {
            await ctx.reply(`L\`evento è stato pubblicato correttamente!`);
        } else {
            await ctx.reply(`L\`evento è stato pubblicato correttamente in @${chat.username}!`);
        }

        await ctx.answerCallbackQuery();
        await ctx.editMessageReplyMarkup({});
    });

    bot.callbackQuery('cancel', async (ctx) => {
        await ctx.reply('L\'evento è stato annullato.');
        ctx.session = { builder: new EventBuilder(), groupId: ctx.session.groupId };
        await ctx.reply('Inizia di nuovo la creazione dell\'evento inviando /start.');

        await ctx.answerCallbackQuery();
        await ctx.editMessageReplyMarkup({});
    });

    bot.callbackQuery('skip', async (ctx) => {
        const builder = ctx.session.builder;
        if (!builder) {
            await ctx.reply('Non hai ancora creato l\'evento.');
            return;
        }
        await stepHandler(ctx, null);
        
        await ctx.answerCallbackQuery();
        await ctx.editMessageReplyMarkup({});
    });

    bot.on('message', async (ctx) => {
        if (ctx.update.message.chat.type != 'private') return;

        const text = ctx.message.text || '';
        await stepHandler(ctx, text); 
    });

    return bot;
}

export type Bot = ReturnType<typeof createBot>;
