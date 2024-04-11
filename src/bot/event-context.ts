import { Context, SessionFlavor } from "grammy";
import { ConversationFlavor } from "@grammyjs/conversations";

export type EventContext = Context & SessionFlavor<{
    groupId: number;
}> & ConversationFlavor