import { EventContext } from "../event-context.js";

export async function publishHandler(ctx: EventContext): Promise<void> {
    const builder = ctx.session.builder;
    const chatId = ctx.session.groupId;

    const script = builder.formatEvent();
    const photoId = builder.getPhotoId();

    if (photoId) {
        const message = await ctx.api.sendPhoto(chatId, photoId, { caption: script, parse_mode: 'MarkdownV2' });

        try {
            await ctx.api.pinChatMessage(message.chat.id, message.message_id, { disable_notification: true });
        } catch (e) {
            await ctx.reply('Impossibile pinnare il messaggio, il bot deve essere un amministratore!');
        }
    } else {
        const message = await ctx.api.sendMessage(chatId, script, { parse_mode: 'MarkdownV2', link_preview_options: { is_disabled: true } });

        try {
            await ctx.api.pinChatMessage(message.chat.id, message.message_id, { disable_notification: true });
        } catch (e) {
            console.log(e);
        }
    }

    const invite = ctx.session.builder.getInvite();

    if (invite === 'poll') {
        const poll = await ctx.api.sendPoll(
            chatId,
            builder.getFullTitle(),
            ['Ci sono 🧗‍♂️', 'Non ci sono 😥', 'Ho bisogno di un passaggio 🛒'],
            {
                is_anonymous: false,
                allows_multiple_answers: true
            }
        )
        try {
            await ctx.api.pinChatMessage(poll.chat.id, poll.message_id, { disable_notification: true });
        } catch (e) {
            console.log(e);
        }
    }

    if (invite !== 'poll' && invite !== null) {
        const message = await ctx.api.sendMessage(chatId,
            `*GRUPPO DELL'ESCURSIONE ${builder.getFullTitle()}:*\n\n${invite}`,
            { parse_mode: 'Markdown' });
        try {
            await ctx.api.pinChatMessage(message.chat.id, message.message_id, { disable_notification: true });
        } catch (e) {
            console.log(e);
        }
    }

}