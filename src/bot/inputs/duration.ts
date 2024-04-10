import { EventBuilder } from "../models/event-builder.js";

export async function durationInput(ctx: any, text: string | null): Promise<void> {
    if (!text) return;

    const builder = ctx.session.builder as EventBuilder;

    builder.setDuration(text);
    await ctx.reply('Inserisci la distanza totale dell\'evento (es., 10km):');
}