import { EventContext } from "../event-context.js";

export async function descriptionInput(ctx: EventContext, text: string | null): Promise<void> {
    const builder = ctx.session.builder;

    builder.setDescription(text);
    await ctx.reply(`Carica un\'immagine per descrivere al meglio l\'evento:`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Salta', callback_data: 'skip' }]
            ]
        }
    });
}