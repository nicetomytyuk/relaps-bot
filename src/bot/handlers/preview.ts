import { EventContext } from "../event-context.js";

export async function previewHandler(ctx: EventContext): Promise<void> {
    const builder = ctx.session.builder;

    const photoId = builder.getPhotoId();
    const script = builder.formatEvent();

    if (photoId) {
        await ctx.replyWithPhoto(photoId, {
            caption: script, parse_mode: 'MarkdownV2', reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Pubblica',
                            callback_data: 'publish'
                        },
                        {
                            text: 'Annulla',
                            callback_data: 'cancel'
                        }
                    ]
                ]
            }
        });
    } else {
        await ctx.reply(script, {
            parse_mode: 'MarkdownV2', link_preview_options: { is_disabled: true }, reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Pubblica',
                            callback_data: 'publish'
                        },
                        {
                            text: 'Annulla',
                            callback_data: 'cancel'
                        }
                    ]
                ]
            }
        });
    }
}