import { GrammyError, HttpError, Bot as TelegramBot, session } from "grammy";
import { EventContext, SessionData } from "./event-context.js";

import { autoRetry } from "@grammyjs/auto-retry";
import {
    conversations,
    createConversation,
} from "@grammyjs/conversations";

import { createEvent } from "./conversations/event.js";
import { freeStorage } from "@grammyjs/storage-free";
import { onHike, onNike, onStart } from "./commands/index.js";
import { checkIfAdmin, getSessionKey } from "./middlewares/index.js";

export function createBot(token: string) {
    const bot = new TelegramBot<EventContext>(token);

    bot.catch((err) => {
        console.error(`Error while handling update ${err.ctx.update.update_id}:`);

        err.error instanceof GrammyError
            ? console.error('Error in request:', err.error.description)
            : err.error instanceof HttpError
                ? console.error('Could not contact Telegram:', err.error)
                : console.error('Unknown error:', err.error);
    });

    // Set the session middleware and initialize session data
    bot.use(session({ getSessionKey, initial: () => ({ groupId: 0 }), storage: freeStorage<SessionData>(bot.token) }));

    // Set the auto-retry middleware
    bot.api.config.use(autoRetry());

    // Create the callback to private chat with groupId payload
    bot.chatType(["group", "supergroup"]).command('nike', checkIfAdmin, onNike);

    // Create the callback to private chat with groupId payload
    bot.chatType(["group", "supergroup"]).command('hike', checkIfAdmin, onHike);

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
    bot.chatType("private").command('start', onStart);

    return bot;
}

export type Bot = ReturnType<typeof createBot>;
