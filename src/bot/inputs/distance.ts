import { EventContext } from "../event-context.js";

export async function distanceInput(ctx: EventContext, text: string | null): Promise<void> {
    if (!text) return;

    const builder = ctx.session.builder;

    builder.setTotalDistance(text);
    await ctx.reply('Inserisci l\'equipaggiamento necessario\n(es., Scarponi, Bastoncini):', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Salta', callback_data: 'skip' }]
            ]
        }
    });
}
