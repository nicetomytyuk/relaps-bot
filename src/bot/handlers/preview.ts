import { InlineKeyboard } from "grammy";
import { EventContext } from "../event-context.js";

export async function previewHandler(ctx: EventContext): Promise<void> {
    const builder = ctx.session.builder;

    const photoId = builder.getPhotoId();
    const script = builder.formatEvent();

    const invite = ctx.session.builder.getInvite();

    const keyboard = new InlineKeyboard().text('Pubblica', 'publish').text('Annulla', 'cancel');

    if (photoId) {
        if (invite !== null) {
            await ctx.replyWithPhoto(photoId, { caption: script, parse_mode: 'MarkdownV2' });
        } else {
            await ctx.replyWithPhoto(photoId, { caption: script, parse_mode: 'MarkdownV2', reply_markup: keyboard });
        }
    } else {
        if (invite !== null) {
            await ctx.reply(script, { parse_mode: 'MarkdownV2' });
        } else {
            await ctx.reply(script, { parse_mode: 'MarkdownV2', reply_markup: keyboard });
        }
    }

    if (invite !== 'poll' && invite !== null) {
        await ctx.reply(`*GRUPPO DELL'ESCURSIONE ${builder.getFullTitle()}:*\n\n${invite}`, { parse_mode: 'Markdown', reply_markup: keyboard });
    }

    if (invite === 'poll') {
        await ctx.replyWithPoll(
            builder.getFullTitle(),
            ['Ci sono 🧗‍♂️', 'Non ci sono 😥', 'Ho bisogno di un passaggio 🛒'],
            {
                is_anonymous: false,
                allows_multiple_answers: true
            }
        )

        await ctx.reply('Ecco un\'anteprima dell\'evento, vuoi pubblicarlo?', { parse_mode: 'Markdown', reply_markup: keyboard });
    }
}