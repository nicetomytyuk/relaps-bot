import { EventBuilder } from "../models/event-builder.js";

export async function itineraryInput(ctx: any, text: string | null): Promise<void> {
    if (!text) return;

    const builder = ctx.session.builder as EventBuilder;
    builder.setItinerary(text);
}