import { ChatTypeContext } from "grammy";
import { EventContext } from "../event-context.js";
import { sleep } from "../utils/utils.js";
import { Commands } from "@grammyjs/commands";

const BOT_NAME = "relaps_bot";

async function onHike(ctx: ChatTypeContext<EventContext, "group" | "supergroup">) {
    console.log(`onHike called by ${ctx.from?.username}`);
    
    const message = await ctx.reply('Benvenuto nel bot di escursionismo di @relaps_hiking!', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Crea il tuo evento!', url: `https://t.me/${BOT_NAME}?start=${ctx.chat.id}` }]
            ]
        }
    });

    try {
        await sleep(5000);
        await ctx.deleteMessage();
        await ctx.api.deleteMessage(ctx.chat.id, message.message_id);
    } catch (e) {
        console.log(e);
    }
}

export const hikeFactory = (commands: Commands<EventContext>) => {
    commands.command("hike", "Crea il tuo evento di escursionismo")
    .addToScope(
        { type: "all_chat_administrators" },
        onHike
    );
}