import { Context, SessionFlavor } from "grammy";
import { EventBuilder } from "./models/event-builder.js";

export type EventContext = Context & SessionFlavor<{
    groupId: number;
    builder: EventBuilder;
}>