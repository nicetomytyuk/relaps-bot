import { dateInput, descriptionInput, difficultLevelInput, distanceInput, durationInput, equipmentInput, inviteInput, meetingPointInput, photoInput, startTimeInput, titleInput } from "../inputs/index.js";
import { itineraryInput } from "../inputs/itinerary.js";
import { EventContext } from "../event-context.js";
import { previewHandler } from "./index.js";

export async function stepHandler(ctx: EventContext, text: string | null): Promise<void> {
    const builder = ctx.session.builder;

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
            break;
        case 13:
            await inviteInput(ctx, text);
            await previewHandler(ctx);
            break;
        default:
            break;
    }
}