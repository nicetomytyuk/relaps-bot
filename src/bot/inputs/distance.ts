import { EventBuilder } from "../models/event-builder.js";

export async function distanceInput(ctx: any, text: string | null): Promise<void> {
    if (!text) return;

    const builder = ctx.session.builder as EventBuilder;

    builder.setTotalDistance(text);
    await ctx.reply('Inserisci l\'equipaggiamento necessario\n(es., Scarponi, Bastoncini):', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Salta', callback_data: 'skip' }]
            ]
        }
    });
}
