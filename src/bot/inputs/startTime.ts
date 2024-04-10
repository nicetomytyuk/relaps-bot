import { EventContext } from "../event-context.js";

export async function startTimeInput(ctx: EventContext, text: string | null): Promise<void> {
    if (!text) return;

    const builder = ctx.session.builder;

    builder.setStartTime(text);
    await ctx.reply('Inserisci l\'URL del luogo di incontro:');
}