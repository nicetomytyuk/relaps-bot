import { EventBuilder } from "../models/event-builder.js";

export async function startTimeInput(ctx: any, text: string | null): Promise<void> {
    if (!text) return;

    const builder = ctx.session.builder as EventBuilder;

    builder.setStartTime(text);
    await ctx.reply('Inserisci l\'URL del luogo di incontro:');
}