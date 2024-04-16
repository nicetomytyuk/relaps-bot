import { CommandContext } from "grammy";
import { EventContext } from "../event-context.js";

export async function onStart(ctx: CommandContext<EventContext>) {
    ctx.session.groupId = parseInt(ctx.match) || ctx.session.groupId;

    if (!ctx.session.groupId) {
        await ctx.reply('Per utilizzare il bot, invia il comando /hike da una chat di gruppo.');
        return;
    }
   
    const chat = await ctx.api.getChat(ctx.session.groupId);
    if (chat.type != "supergroup") {
        await ctx.reply(`Ti aiuterò a creare il tuo evento di escursionismo.`);
    } else {
        if (chat.username) {
            await ctx.reply(`Stai per creare un evento per il gruppo @${chat.username}.`);
        }else {
            await ctx.reply(`Ti aiuterò a creare il tuo evento di escursionismo.`);
        }
    }

    await ctx.conversation.enter("createEvent");
}