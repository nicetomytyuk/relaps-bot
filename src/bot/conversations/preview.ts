import { InlineKeyboard } from "grammy";
import { EventContext } from "../event-context.js";
import { Conversation } from "@grammyjs/conversations";
import { publish } from "./publish.js";
import { EventBuilder } from "../models/event-builder.js";

type EventConversation = Conversation<EventContext>;

export async function createPreview(builder: EventBuilder, conversation: EventConversation, ctx: EventContext): Promise<void> {
    const photoId = builder.getPhotoId();
    const script = builder.getEvent();
    const invite = builder.getInvite();

    const keyboard = new InlineKeyboard().text('Pubblica', 'publish').text('Annulla', 'cancel');

    try {
        const MAX_CAPTION_LENGTH = 1024;
        if (photoId) {
            if (script.length > MAX_CAPTION_LENGTH) {
                await ctx.reply("L'immagine è stata rimossa dato che il testo supera il limite dei 1024 caratteri!");
                await ctx.reply(script, { parse_mode: 'MarkdownV2', link_preview_options: { is_disabled: true } });
            }else {
                await ctx.replyWithPhoto(photoId, { caption: script, parse_mode: 'MarkdownV2' });
            }
        } else {
            await ctx.reply(script, { parse_mode: 'MarkdownV2', link_preview_options: { is_disabled: true } });
        }
    }catch (e) {
        await ctx.reply('Non è stato possibile pubblicare l\'evento, riprova più tardi.');
    }

    if (invite !== null && invite !== 'none' && invite !== 'poll') {
        const title = builder.getFullTitle().replace(/[-_.!()]/g, '\\$&');
        await ctx.reply(`*[GRUPPO DELL'ESCURSIONE ${title}](${invite})*`, { parse_mode: 'MarkdownV2' });
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
    }

    await ctx.reply('Ecco un\'anteprima dell\'evento, vuoi pubblicarlo?', { parse_mode: 'Markdown', reply_markup: keyboard });

    const response = await conversation.waitForCallbackQuery(["publish", "cancel"], {
        otherwise: (ctx) => ctx.reply("Per favore, fai una scelta per proccedere!", { reply_markup: keyboard })
    });

    await response.answerCallbackQuery();

    if (response.match === 'publish') {
        try {
            await publish(builder, ctx);
            await response.deleteMessage();
    
            const chat = await ctx.api.getChat(ctx.session.groupId);
            if (chat.type != "supergroup") {
                await ctx.reply(`L\`evento è stato pubblicato correttamente!`);
            } else {
                if (chat.username) {
                    await ctx.reply(`L\`evento è stato pubblicato correttamente in @${chat.username}!`);
                }else {
                    await ctx.reply(`L\`evento è stato pubblicato correttamente!`);
                }
            }
        }catch (e) {
            console.error(e);
        }
    }

    if (response.match === 'cancel') {
        await ctx.reply('L\'evento è stato annullato.');
        await ctx.reply('Inizia di nuovo la creazione dell\'evento inviando /start.');
        await response.deleteMessage();
    }
}