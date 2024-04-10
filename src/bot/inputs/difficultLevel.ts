import { EventBuilder } from "../models/event-builder.js";

export async function difficultLevelInput(ctx: any, text: string | null): Promise<void> {
    if (!text) return;

    const builder = ctx.session.builder as EventBuilder;

    builder.setDifficultyLevel(text);
    await ctx.reply('Inserisci la durata dell\'evento (es., 1h 30m):');
}