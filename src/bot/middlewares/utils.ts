import { Context, NextFunction } from "grammy";

export function getSessionKey(ctx: Context) {
    return ctx.from?.id.toString();
}

export async function checkIfAdmin(ctx: Context, next: NextFunction) {
    const userId = ctx.update.message?.from.id || null;
    
    if (!userId) {
		await ctx.reply("Errore durante l'autenticazione.");
        return;
    }

	const user = await ctx.getChatMember(userId);
	if(["owner", "creator", "administrator"].includes(user.status) == false) {
		await ctx.reply("Devi essere un amministratore per poter utilizzare questo bot.");
		return;
	}
	await next();
}


export async function checkIfGroup(ctx: Context, next: NextFunction) {
    if (!ctx.msg) {
        await ctx.reply("Questo comando è utilizzabile solo in chat di gruppo.");
        return;
    }

	if(['group','supergroup','channel'].includes(ctx.msg.chat.type) == false) {
		await ctx.reply("Questo comando è utilizzabile solo in chat di gruppo.");
		return;
	}
	await next();
}

export async function checkIfPrivate(ctx: Context, next: NextFunction) {
    if (!ctx.update.message) {
		await ctx.reply("Questo comando è utilizzabile solo in chat privata, prova con /hike!");
        return;
    }

	if(ctx.update.message.chat.type != 'private') {
        await ctx.reply("Questo comando è utilizzabile solo in chat privata, prova con /hike!");
		return;
	}
	await next();
}