import { CommandContext } from "grammy";
import { EventContext } from "../event-context.js";

const sleep = async (miliseconds: number) => new Promise(resolve => setTimeout(resolve, miliseconds));

export async function onNike(ctx: CommandContext<EventContext>) {
    console.log(`onHike called by ${ctx.from?.username}`);
    
    const message = await ctx.reply('Ao! Guarda che il comando è /hike!');

    try {
        await sleep(5000);
        await ctx.deleteMessage();
        await ctx.api.deleteMessage(ctx.chat.id, message.message_id);
    } catch (e) {
        console.log(e);
    }
}