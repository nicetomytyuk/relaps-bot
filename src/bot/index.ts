import { Bot as TelegramBot, session } from "grammy";
import { EventBuilder } from "./models/event-builder.js";
import { EventContext } from "./event-context.js";
import { checkIfAdmin, checkIfGroup, checkIfPrivate, getSessionKey } from "./middlewares.js";

import { autoRetry } from "@grammyjs/auto-retry";
import { previewHandler, publishHandler, stepHandler } from "./handlers/index.js";


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

        ctx.session.builder = new EventBuilder();

        const chat = await bot.api.getChat(ctx.session.groupId);
        if (chat.type != "supergroup") {
            await ctx.reply(`Ti aiuterò a creare il tuo evento di escursionismo.`);
        } else {
            await ctx.reply(`Stai per creare un evento per il gruppo @${chat.username}.`);
        }

        await ctx.reply('Inserisci il nome dell\'evento (es., Giro ad anello Monte Rosa):')
    });

    bot.on('callback_query:data', async (ctx) => {
        const [prefix, action] = ctx.callbackQuery.data.split(':');

        if (prefix === 'preview') {
            if (action === 'group') {
                // The stepper will be set to 12 after the user completes the full-fillment of the event
                // if the invitation is a group the stepper must be set to 13 to accept the group link in input
                // thats why of .nextStep() called here
                ctx.session.builder.nextStep();
                await ctx.reply('Inserisci il link del gruppo Telegram o WhatsApp:');
            } else {
                ctx.session.builder.setInvite(action as string | null);
                await previewHandler(ctx);
            }
            await ctx.editMessageReplyMarkup();
        }

        if (prefix === 'skip') {
            await stepHandler(ctx, null);
            await ctx.editMessageReplyMarkup();
        }

        if (prefix === 'cancel') {
            await ctx.reply('L\'evento è stato annullato.');
            ctx.session = { builder: new EventBuilder(), groupId: ctx.session.groupId };
            await ctx.reply('Inizia di nuovo la creazione dell\'evento inviando /start.');
            await ctx.editMessageReplyMarkup();
            await ctx.deleteMessage();
        }

        if (prefix === 'publish') {
            await publishHandler(ctx);

            const chat = await bot.api.getChat(ctx.session.groupId);
            if (chat.type != "supergroup") {
                await ctx.reply(`L\`evento è stato pubblicato correttamente!`);
            } else {
                await ctx.reply(`L\`evento è stato pubblicato correttamente in @${chat.username}!`);
            }
            
            await ctx.editMessageReplyMarkup();
            await ctx.deleteMessage();
        }

        await ctx.answerCallbackQuery();
    });

    bot.on('message', async (ctx) => {
        if (ctx.update.message.chat.type != 'private') return;

        const text = ctx.message.text || '';
        await stepHandler(ctx, text);
    });

    return bot;
}

export type Bot = ReturnType<typeof createBot>;
