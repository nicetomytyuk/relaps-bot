import { EventContext } from "../event-context.js";

export async function durationInput(ctx: EventContext, text: string | null): Promise<void> {
    if (!text) return;

    const builder = ctx.session.builder;

    builder.setDuration(text);
    await ctx.reply('Inserisci la distanza totale dell\'evento (es., 10km):');
}