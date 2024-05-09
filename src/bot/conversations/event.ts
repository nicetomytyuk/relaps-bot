import {
    type Conversation,
  } from "@grammyjs/conversations";
import { EventContext } from "../event-context.js";
import { InlineKeyboard } from "grammy";
import { createPreview } from "./preview.js";
import { EventBuilder, defaultEquipment } from "../models/event-builder.js";

type EventConversation = Conversation<EventContext>;

const skip = new InlineKeyboard().text('Salta', 'skip');

export async function createEvent(conversation: EventConversation, ctx: EventContext) {
    const builder = new EventBuilder();

    await ctx.reply('Inserisci il nome dell\'evento (es., Giro ad anello Monte Rosa):')
    builder.setTitle(await conversation.form.text());

    await ctx.reply('Inserisci una breve descrizione dell\'evento:', { reply_markup: skip })
    do {
        ctx = await conversation.waitFor([":text", "callback_query:data"]);
        if (ctx.callbackQuery?.data === 'skip') {
            await ctx.editMessageReplyMarkup();
            await ctx.answerCallbackQuery();
            break;
        }

        if (ctx.msg?.text) {
            builder.setDescription(ctx.msg.text);
            break;
        }
        
        await ctx.reply('Per favore, inserisci una descrizione valida oppure salta il passaggio.', { reply_markup: skip });
    } while (!ctx.msg?.text || ctx.callbackQuery?.data === 'skip');

    await ctx.reply(`Carica un\'immagine per descrivere al meglio l\'evento:`, { reply_markup: skip });
    do {
        ctx = await conversation.waitFor([":photo", "callback_query:data"]);
        
        if (ctx.callbackQuery?.data === 'skip') {
            await ctx.editMessageReplyMarkup();
            await ctx.answerCallbackQuery();
            break;
        }

        if (ctx.message?.photo) {
            const photo = ctx.message.photo;
            builder.setPhotoId(photo[photo.length - 1].file_id);
            break;
        }

        await ctx.reply('Per favore, invia un\'immagine oppure salta il passaggio.', { reply_markup: skip });
    } while (!ctx.message?.photo || ctx.callbackQuery?.data === 'skip');

    await ctx.reply('Inserisci la data dell\'evento (es., 11/02/2024):');
    builder.setDate(await conversation.form.text());

    await ctx.reply('Inserisci l\'orario di incontro (es., 10:00-10:15):');
    builder.setStartTime(await conversation.form.text());

    await ctx.reply('Inserisci l\'URL del luogo di incontro:');
    builder.setMeetingPoint(await conversation.form.text());

    await ctx.reply('Inserisci il livello di difficoltà dell\'evento (es., Intermedio):');
    builder.setDifficulty(await conversation.form.text());
    
    await ctx.reply('Inserisci la durata dell\'evento (es., 1h 30m):');
    builder.setDuration(await conversation.form.text());

    await ctx.reply('Inserisci la distanza totale dell\'evento (es., 10km):');
    builder.setDistance(await conversation.form.text());

    await ctx.reply('Inserisci il dislivello positivo (es., 760m):', { reply_markup: skip });
    do {
        ctx = await conversation.waitFor([":text", "callback_query:data"]);
        if (ctx.callbackQuery?.data === 'skip') {
            await ctx.editMessageReplyMarkup();
            await ctx.answerCallbackQuery();
            break;
        }

        if (ctx.msg?.text) {
            builder.setHeight(ctx.msg.text);
            break;
        }
        
        await ctx.reply('Per favore, inserisci un dislivello valido oppure salta il passaggio.', { reply_markup: skip });
    } while (!ctx.msg?.text || ctx.callbackQuery?.data === 'skip');

    await ctx.reply(`Attrezzatura predefinita:\n${defaultEquipment.map(equipment => `• ${equipment}`).join('\n')}`);
    await ctx.reply('Inserisci l\'attrezzatura aggiuntiva:\n(es., Crema solare, Ramponcini)', { reply_markup: skip })
    do {
        ctx = await conversation.waitFor([":text", "callback_query:data"]);
        if (ctx.callbackQuery?.data === 'skip') {
            builder.setEquipment(null);
            
            await ctx.editMessageReplyMarkup();
            await ctx.answerCallbackQuery();
            break;
        }

        if (ctx.msg?.text) {
            builder.setEquipment(ctx.msg.text);
            break;
        }
        await ctx.reply('Per favore, inserisci un valore valido per l\'attrezzatura oppure salta il passaggio.', { reply_markup: skip });
    } while (!ctx.msg?.text || ctx.callbackQuery?.data === 'skip')
        
    await ctx.reply('Inserisci l\'URL dell\'itinerario:');
    builder.setItinerary(await conversation.form.text());

    const keyboard = new InlineKeyboard()
        .text("Sondaggio", "preview:poll")
        .text("Gruppo", "preview:group")
        .text("Nessunno", "preview:none")

    await ctx.reply('Vuoi pubblicare un sondaggio o l\'invito al gruppo?', {
        reply_markup: keyboard
    });

    const response = await conversation.waitForCallbackQuery(["preview:poll", "preview:group", "preview:none"], {
        otherwise: (ctx) => ctx.reply("Per favore, fai una scelta per proccedere!", { reply_markup: keyboard })
    });
    await response.editMessageReplyMarkup();
    await response.answerCallbackQuery();

    if (response.match === "preview:poll") {
        builder.setInvite("poll");
    }

    if (response.match === "preview:group") {
        await ctx.reply('Inserisci il link del gruppo Telegram o WhatsApp:');
        builder.setInvite(await conversation.form.text());
    }

    if (response.match === "preview:none") {
        builder.setInvite("none");
    }

    await createPreview(builder, conversation, ctx);
}