import { EventBuilder } from "../models/event-builder.js";
import { dateInput, descriptionInput, difficultLevelInput, distanceInput, durationInput, equipmentInput, meetingPointInput, photoInput, startTimeInput, titleInput } from "../inputs/index.js";
import { itineraryInput } from "../inputs/itinerary.js";
import { previewHandler } from "./index.js";

export async function stepHandler(ctx: any, text: string | null): Promise<void> {
    const builder = ctx.session.builder as EventBuilder;

    switch (builder.getStep()) {
        case 1:
            await titleInput(ctx, text);
            break;
        case 2:
            await descriptionInput(ctx, text);
            break;
        case 3:
            await photoInput(ctx, text);
            break;
        case 4:
            await dateInput(ctx, text);
            break;
        case 5:
            await startTimeInput(ctx, text);
            break;
        case 6:
            await meetingPointInput(ctx, text);
            break;
        case 7:
            await difficultLevelInput(ctx, text);
            break;
        case 8:
            await durationInput(ctx, text);
            break;
        case 9:
            await distanceInput(ctx, text);
            break;
        case 10:
            await equipmentInput(ctx, text);
            break;
        case 11:
            await itineraryInput(ctx, text);
            await previewHandler(ctx);
            break;
        default:
            await ctx.reply('Comando non riconosciuto. Invia il comando /start per iniziare!');
            break;
    }
}