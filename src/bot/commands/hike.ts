import { CommandContext } from "grammy";
import { EventContext } from "../event-context.js";

const sleep = async (miliseconds: number) => new Promise(resolve => setTimeout(resolve, miliseconds));

export async function onHike(ctx: CommandContext<EventContext>) {
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
}