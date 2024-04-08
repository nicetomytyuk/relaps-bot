import { Bot } from "grammy";
import dotenv from 'dotenv';
import { EventBuilder } from "./models/event-builder";

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN || '';

const states = new Map<number, EventBuilder>();

//Create a new bot
const bot = new Bot(BOT_TOKEN);

bot.command('start', async (ctx) => {
    const chatId = ctx.chat.id;
    states.set(chatId, new EventBuilder());

    await ctx.reply('Benvenuto!\nTi darò una mano a creare il tuo evento di escursionismo.');
    await ctx.reply('Inserisci il nome dell\'evento (es., Giro ad anello Monte Rosa):')
});

bot.on('message', async (ctx) => {
    const chatId = ctx.chat.id;
    const text = ctx.message.text;

    const builder = states.get(chatId);

    if (!text) {
        await ctx.reply('Invia il comando /start per iniziare!');
        return;
    }

    if (!builder) {
        await ctx.reply('Invia il comando /start per iniziare!');
        return;
    }

    switch (builder.getStep()) {
        case 1:
            builder.setTitle(text);
            await ctx.reply('Inserisci una breve descrizione dell\'evento (oppure "-" per non inserire una descrizione):');
            states.set(chatId, builder);
            break;
        case 2:
            builder.setDescription(text);
            await ctx.reply('Carica un\'immagine per descrivere almeglio l\'evento:');
            states.set(chatId, builder);
            break;
        case 3:
            if ('photo' in ctx.message) {
                const photo = ctx.message.photo;
                if (photo) {
                    builder.setPhotoId(photo[photo.length - 1].file_id);
                }

                await ctx.reply('Inserisci la data dell\'evento (es., 11/02/2024):');
                states.set(chatId, builder);
            } else {
                await ctx.reply('Per favore, invia un\'immagine.');
            }
            break;
        case 4:
            builder.setDate(text);
            await ctx.reply('Inserisci l\'orario di incontro (es., 10:00-10:15):');
            states.set(chatId, builder);
            break;
        case 5:
            builder.setStartTime(text);
            await ctx.reply('Inserisci l\'URL del luogo di incontro:');
            states.set(chatId, builder);
            break;
        case 6:
            builder.setMeetingPoint(text);
            await ctx.reply('Inserisci il livello di difficoltà dell\'evento (es., Intermedio):');
            states.set(chatId, builder);
            break;
        case 7:
            builder.setDifficultyLevel(text);
            await ctx.reply('Inserisci la durata dell\'evento (es., 1h 30m):');
            states.set(chatId, builder);
            break;
        case 8:
            builder.setDuration(text);
            await ctx.reply('Inserisci la distanza totale dell\'evento (es., 10km):');
            states.set(chatId, builder);
            break;
        case 9:
            builder.setTotalDistance(text);
            await ctx.reply('Inserisci l\'equipaggiamento necessario\n(es., Scarponi, Bastoncini)\n:');
            states.set(chatId, builder);
            break;
        case 10:
            builder.setEquipment(text.split(','));
            await ctx.reply('Inserisci l\'URL dell\'itinerario:');
            states.set(chatId, builder);
            break;
        case 11:
            builder.setItinerary(text);
            await ctx.reply('Il tuo evento è stato creato con successo!');

            const photoId = builder.getPhotoId();
            if (photoId) {
                const script = builder.formatEvent();

                await ctx.replyWithPhoto(
                    photoId,
                    {
                        caption: script,
                        parse_mode: 'Markdown',
                    }
                )
            }

            await ctx.api.sendPoll(
                chatId,
                builder.getFullTitle(),
                ['Ci sono 🧗‍♂️', 'Non ci sono 😥', 'Ho bisogno di un passaggio 🛒'],
                {
                    is_anonymous: false,
                    allows_multiple_answers: true
                }
            )

            states.delete(chatId);
            break;
        default:
            await ctx.reply('Comando non riconosciuto. Invia il comando /start per iniziare!');
            break;

    }
});

//Start the Bot
bot.start();