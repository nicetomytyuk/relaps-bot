import { CommandContext } from "grammy";
import { EventContext } from "../event-context.js";

const sleep = async (miliseconds: number) => new Promise(resolve => setTimeout(resolve, miliseconds));

const BOT_NAME = "relaps_bot";

export async function onHike(ctx: CommandContext<EventContext>) {
    console.log(`onHike called by ${ctx.from?.username}`);
    
    const message = await ctx.reply('Benvenuto nel bot di escursionismo di @relaps_hiking!', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Crea il tuo evento!', url: `https://t.me/${BOT_NAME}?start=${ctx.chat.id}` }]
            ]
        }
    });

    await sleep(5000);

    try {
        await ctx.deleteMessage();
        await ctx.api.deleteMessage(ctx.chat.id, message.message_id);
    } catch (e) {
        console.log(e);
    }
}