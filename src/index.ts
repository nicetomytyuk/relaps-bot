import { Bot, Context } from "grammy";
import dotenv from 'dotenv';
import { EventBuilder } from "./models/event-builder";

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN || '';

const states = new Map<number, EventBuilder>();
const groups = new Map();

//Create a new bot
const bot = new Bot(BOT_TOKEN);

bot.command('start', async (ctx) => {
    if (ctx.chat.type === 'group') {
        if (await isAdmin(ctx)) {
            const adminId = ctx.from?.id;
            const chatId = ctx.chat.id;

            if (!adminId) return;

            groups.set(adminId, chatId);
            await ctx.reply('Benvenuto nel bot di escursionismo di @relaps_hiking!', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Crea il tuo evento!', url: 'https://t.me/igor_mytyuk_bot?start=start' }]
                    ]
                }
            });
        } else {
            await ctx.reply('Non sei autorizzato ad usare questo bot.');
            return;
        }
    }else if (ctx.chat.type === 'private') {
         const adminId = ctx.from?.id;
         const chatId = ctx.chat.id;

         if (!adminId) return;

         if (!groups.has(adminId)) {
            await ctx.reply('Per utilizzare il bot, invia il comando /start da una chat di gruppo.');
            return;
         }

         states.set(chatId, new EventBuilder());
        
         await ctx.reply('Ti darò una mano a creare il tuo evento di escursionismo.');
         await ctx.reply('Inserisci il nome dell\'evento (es., Giro ad anello Monte Rosa):')
    }
});

async function isAdmin(ctx: Context) {
    const admins = await ctx.getChatAdministrators();
    console.log(admins);
    return admins.some(admin => admin.user.id === ctx.from?.id);
}

bot.callbackQuery('publish', async (ctx) => {
    const adminId = ctx.from?.id;

    if (!adminId) return;
    if (!groups.has(adminId)) {
        await ctx.reply('Per utilizzare il bot, invia il comando /start da una chat di gruppo.');
        return;
    }

    const chatId = groups.get(adminId);
    const builder = states.get(ctx.callbackQuery.from.id);

    if (!builder) {
        await ctx.reply('Per favore, inizia il processo di creazione di un nuovo evento inviando il comando /start da una chat di gruppo.');
        return;
    }

    const script = builder.formatEvent();
    const photoId = builder.getPhotoId();

    if (photoId) {
        const message = await ctx.api.sendPhoto(chatId, photoId, { caption: script, parse_mode: 'Markdown' });
        await ctx.api.pinChatMessage(message.chat.id, message.message_id, { disable_notification: true });
    } else {
        const message = await ctx.api.sendMessage(chatId, script, { parse_mode: 'Markdown', link_preview_options: { is_disabled: true } });
        await ctx.api.pinChatMessage(message.chat.id, message.message_id, { disable_notification: true });
    }
    
    const poll = await ctx.api.sendPoll(
        chatId,
        builder.getFullTitle(),
        ['Ci sono 🧗‍♂️', 'Non ci sono 😥', 'Ho bisogno di un passaggio 🛒'],
        {
            is_anonymous: false,
            allows_multiple_answers: true
        }
    )

    await ctx.api.pinChatMessage(chatId, poll.message_id, { disable_notification: true });

    await ctx.reply('L\'evento è stato pubblicato correttamente!');
});

bot.callbackQuery('cancel', async (ctx) => {
    states.delete(ctx.callbackQuery.from.id);

    await ctx.reply('L\'evento è stato annullato.');
    await ctx.reply('Puoi riprendere il processo di creazione di un nuovo evento inviando il comando /start da una chat di gruppo.');
});

bot.on('message', async (ctx) => {
    const chatId = ctx.chat.id;
    const text = ctx.message.text || '';

    const builder = states.get(chatId);

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
            await ctx.reply('Carica un\'immagine per descrivere al meglio l\'evento:');
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
            await ctx.reply('Inserisci l\'equipaggiamento necessario\n(es., Scarponi, Bastoncini):');
            states.set(chatId, builder);
            break;
        case 10:
            builder.setEquipment(text.split(','));
            await ctx.reply('Inserisci l\'URL dell\'itinerario:');
            states.set(chatId, builder);
            break;
        case 11:
            builder.setItinerary(text);
     
            const photoId = builder.getPhotoId();
            const script = builder.formatEvent();
            if (photoId) {
                await ctx.replyWithPhoto(photoId, { caption: script, parse_mode: 'Markdown' ,                 reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Pubblica',
                                callback_data: 'publish'
                            },
                            {
                                text: 'Annulla',
                                callback_data: 'cancel'
                            }
                        ]
                    ]
                }});
            } else {
                await ctx.reply(script, { parse_mode: 'Markdown', link_preview_options: { is_disabled: true }, reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: 'Pubblica',
                                callback_data: 'publish'
                            },
                            {
                                text: 'Annulla',
                                callback_data: 'cancel'
                            }
                        ]
                    ]
                } });
            }

            break;
        default:
            await ctx.reply('Comando non riconosciuto. Invia il comando /start per iniziare!');
            break;
    }
});

//Start the Bot
bot.start();