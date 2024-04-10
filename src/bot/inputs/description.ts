import { EventBuilder } from "../models/event-builder.js";

export async function descriptionInput(ctx: any, text: string | null): Promise<void> {
    const builder = ctx.session.builder as EventBuilder;

    builder.setDescription(text);
    await ctx.reply(`Carica un\'immagine per descrivere al meglio l\'evento:`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Salta', callback_data: 'skip' }]
            ]
        }
    });
}