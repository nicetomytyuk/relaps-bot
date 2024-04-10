import { EventBuilder } from "../models/event-builder.js";

export async function titleInput(ctx: any, text: string | null): Promise<void> {
    if (!text) return;

    const builder = ctx.session.builder as EventBuilder;

    builder.setTitle(text);
    await ctx.reply(`Inserisci una breve descrizione dell\`evento:`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Salta', callback_data: 'skip' }]
            ]
        }
    });
}