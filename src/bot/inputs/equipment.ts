import { EventBuilder } from "../models/event-builder.js";

export async function equipmentInput(ctx: any, text: string | null): Promise<void> {
    const builder = ctx.session.builder as EventBuilder;

    builder.setEquipment(text);
    await ctx.reply('Inserisci l\'URL dell\'itinerario:');
}