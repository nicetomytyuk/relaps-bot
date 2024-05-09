import { EventContext } from "../event-context.js";
import { EventBuilder } from "../models/event-builder.js";

const MAX_CAPTION_LENGTH = 1024;

export async function publish(builder: EventBuilder, ctx: EventContext): Promise<void> {
    await sendEventMessage(builder, ctx);
    await sendInviteMessage(builder, ctx);
}

async function sendEventMessage(builder: EventBuilder, ctx: EventContext) {
    const chatId = ctx.session.groupId;

    const script = builder.getEvent();
    const photoId = builder.getPhotoId();
    if (photoId) {
        if (script.length > MAX_CAPTION_LENGTH) {
            const message = await ctx.api.sendMessage(chatId, script, { parse_mode: 'MarkdownV2', link_preview_options: { is_disabled: true } });
            await pinChatMessage(ctx, message);
        }else {
            const message = await ctx.api.sendPhoto(chatId, photoId, { caption: script, parse_mode: 'MarkdownV2' });
            await pinChatMessage(ctx, message);
        }
    } else {
        const message = await ctx.api.sendMessage(chatId, script, { parse_mode: 'MarkdownV2', link_preview_options: { is_disabled: true } });
        await pinChatMessage(ctx, message);
    }
}

async function sendInviteMessage(builder: EventBuilder, ctx: EventContext) {
    const chatId = ctx.session.groupId;

    const invite = builder.getInvite();

    if (invite === 'poll') {
        await ctx.api.sendPoll(
            chatId,
            builder.getFullTitle(),
            ['Ci sono 🧗‍♂️', 'Non ci sono 😥', 'Ho bisogno di un passaggio 🛒'],
            {
                is_anonymous: false,
                allows_multiple_answers: true
            }
        )
    }

    if (invite !== null && invite !== 'none' && invite !== 'poll') {
        const title = builder.getFullTitle().replace(/[-_.!]/g, '\\$&');
        await ctx.api.sendMessage(chatId, `*[GRUPPO DELL'ESCURSIONE ${title}](${invite})*`, { parse_mode: 'MarkdownV2' });
    }
}

async function pinChatMessage(ctx: EventContext, message: any) {
    try {
        await ctx.api.pinChatMessage(message.chat.id, message.message_id, { disable_notification: true });
    } catch (e) {
        await ctx.reply('Impossibile pinnare il messaggio, il bot deve essere un amministratore!');
    }
}