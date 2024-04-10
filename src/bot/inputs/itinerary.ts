import { EventContext } from "../event-context.js";

export async function itineraryInput(ctx: EventContext, text: string | null): Promise<void> {
    if (!text) return;

    const builder = ctx.session.builder;
    builder.setItinerary(text);

    await ctx.reply('Vuoi pubblicare un sondaggio o l\'invito al gruppo?', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Sondaggio', callback_data: 'preview:poll' },
                    { text: 'Gruppo', callback_data: 'preview:group' },
                    { text: 'Nessuno', callback_data: 'preview' }
                ]
            ]
        }
    });
}