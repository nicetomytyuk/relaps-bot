import { EventContext } from "../event-context.js";

export async function titleInput(ctx: EventContext, text: string | null): Promise<void> {
    if (!text) return;

    const builder = ctx.session.builder;

    builder.setTitle(text);
    await ctx.reply(`Inserisci una breve descrizione dell\`evento:`, {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Salta', callback_data: 'skip' }]
            ]
        }
    });
}