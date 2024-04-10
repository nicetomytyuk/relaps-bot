import { EventBuilder } from "../models/event-builder.js";

export async function meetingPointInput(ctx: any, text: string | null): Promise<void> {
    if (!text) return;

    const builder = ctx.session.builder as EventBuilder;

    builder.setMeetingPoint(text);
    await ctx.reply('Inserisci il livello di difficoltà dell\'evento (es., Intermedio):');
}