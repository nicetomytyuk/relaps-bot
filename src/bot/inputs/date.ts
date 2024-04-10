import { EventBuilder } from "../models/event-builder.js";

export async function dateInput(ctx: any, text: string | null): Promise<void> {
    if (!text) return;

    const builder = ctx.session.builder as EventBuilder;

    builder.setDate(text);
    await ctx.reply('Inserisci l\'orario di incontro (es., 10:00-10:15):');
}