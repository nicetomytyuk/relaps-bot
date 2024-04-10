import { EventContext } from "../event-context.js";

export async function dateInput(ctx: EventContext, text: string | null): Promise<void> {
    if (!text) return;

    const builder = ctx.session.builder;

    builder.setDate(text);
    await ctx.reply('Inserisci l\'orario di incontro (es., 10:00-10:15):');
}