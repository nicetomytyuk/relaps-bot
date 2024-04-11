import { Context, SessionFlavor } from "grammy";
import { ConversationFlavor } from "@grammyjs/conversations";
import { EventBuilder } from "./models/event-builder.js";

export type EventContext = Context & SessionFlavor<{
    groupId: number;
    builder: EventBuilder;
}> & ConversationFlavor