import { EventContext } from "../event-context.js";

export async function inviteInput(ctx: EventContext, text: string | null): Promise<void> {
    if (!text) return;

    const builder = ctx.session.builder;
    builder.setInvite(text);
}