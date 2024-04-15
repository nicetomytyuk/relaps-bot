import { Context, SessionFlavor } from "grammy";
import { ConversationFlavor } from "@grammyjs/conversations";

export interface SessionData {
    groupId: number;
}

export type EventContext = Context & SessionFlavor<SessionData> & ConversationFlavor