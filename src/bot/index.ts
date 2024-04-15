import { Bot as TelegramBot, session } from "grammy";
import { EventContext, SessionData } from "./event-context.js";
import { checkIfAdmin, checkIfGroup, checkIfPrivate, getSessionKey } from "./middlewares.js";

import { autoRetry } from "@grammyjs/auto-retry";
import {
    conversations,
    createConversation,
} from "@grammyjs/conversations";

import { createEvent } from "./conversations/event.js";
import { freeStorage } from "@grammyjs/storage-free";
import { onHike, onStart } from "./commands/index.js";

export function createBot(token: string) {
    const bot = new TelegramBot<EventContext>(token);

    // Set the session middleware and initialize session data
    bot.use(session({ getSessionKey, initial: () => ({ groupId: 0 }), storage: freeStorage<SessionData>(bot.token) }));

    // Install the conversations plugin.
    bot.chatType("private").use(conversations());
    bot.chatType("private").use(createConversation(createEvent));

    bot.hears(/^\/start(?:@relaps_bot)?\s*(\d*)$/, async (ctx, next) => {
        const isConversationActive = await ctx.conversation.active();
        if (isConversationActive) {
            await ctx.conversation.exit();
        }

        await next();
    });

    /// Set the auto-retry middleware
    bot.api.config.use(autoRetry());

    bot.command('hike', checkIfGroup, checkIfAdmin, onHike);

    bot.command('start', checkIfPrivate, onStart);

    return bot;
}

export type Bot = ReturnType<typeof createBot>;
