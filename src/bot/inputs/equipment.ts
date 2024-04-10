import { EventContext } from "../event-context.js";

export async function equipmentInput(ctx: EventContext, text: string | null): Promise<void> {
    const builder = ctx.session.builder;

    builder.setEquipment(text);
    await ctx.reply('Inserisci l\'URL dell\'itinerario:');
}