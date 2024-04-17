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

    // Set the auto-retry middleware
    bot.api.config.use(autoRetry());

    // Create the callback to private chat with groupId payload
    bot.chatType(["group", "supergroup"]).command('hike', checkIfGroup, checkIfAdmin, onHike);

    // Install the conversations plugin.
    bot.chatType("private").use(conversations());

    // Exit any existing conversation
    bot.chatType("private").command('start', async (ctx, next) => {
        console.log(`Received /start from ${ctx.from?.username}`);

        const isConversationActive = await ctx.conversation.active();
        if (isConversationActive) {
            console.log('Exiting active conversation');
            await ctx.conversation.exit();
        }

        await next();
    });

    bot.chatType("private").use(createConversation(createEvent));

    // Start the conversation for event creation
    bot.chatType("private").command('start', checkIfPrivate, onStart);

    return bot;
}

export type Bot = ReturnType<typeof createBot>;
