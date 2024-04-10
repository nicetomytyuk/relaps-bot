import { EventContext } from "../event-context.js";

export async function meetingPointInput(ctx: EventContext, text: string | null): Promise<void> {
    if (!text) return;

    const builder = ctx.session.builder;

    builder.setMeetingPoint(text);
    await ctx.reply('Inserisci il livello di difficoltà dell\'evento (es., Intermedio):');
}