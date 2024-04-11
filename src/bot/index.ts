import { Bot as TelegramBot, session } from "grammy";
import { EventContext } from "./event-context.js";
import { checkIfAdmin, checkIfGroup, checkIfPrivate, getSessionKey } from "./middlewares.js";

import { autoRetry } from "@grammyjs/auto-retry";
import {
    conversations,
    createConversation,
} from "@grammyjs/conversations";

import { createEvent } from "./conversations/event.js";
import { EventBuilder } from "./models/event-builder.js";

const sleep = async (miliseconds: number) => new Promise(resolve => setTimeout(resolve, miliseconds))

export function createBot(token: string) {
    const bot = new TelegramBot<EventContext>(token);

    // Set the session middleware and initialize session data
    bot.use(session({ getSessionKey, initial: () => ({ builder: new EventBuilder() }) }));

    // Install the conversations plugin.
    bot.use(conversations());
    bot.use(createConversation(createEvent));

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

        await sleep(5000);
        await ctx.deleteMessage();
        await ctx.api.deleteMessage(ctx.chat.id, message.message_id);
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

        await ctx.conversation.enter("createEvent");
    });

    return bot;
}

export type Bot = ReturnType<typeof createBot>;
