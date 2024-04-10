import { EventContext } from "../event-context.js";

export async function difficultLevelInput(ctx: EventContext, text: string | null): Promise<void> {
    if (!text) return;

    const builder = ctx.session.builder;

    builder.setDifficultyLevel(text);
    await ctx.reply('Inserisci la durata dell\'evento (es., 1h 30m):');
}