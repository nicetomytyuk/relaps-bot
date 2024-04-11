import { EventContext } from "../event-context.js";

export async function photoInput(ctx: EventContext, text: string | null): Promise<void> {
    const builder = ctx.session.builder;

    if (text === null) {
        builder.setPhotoId(null);
        await ctx.reply('Inserisci la data dell\'evento (es., 11/02/2024):');
        return;
    }else if (ctx.message && 'photo' in ctx.message) {
        const photo = ctx.message.photo;
        if (photo) {
            builder.setPhotoId(photo[photo.length - 1].file_id);
        }
        await ctx.reply('Inserisci la data dell\'evento (es., 11/02/2024):');
        return;
    }
    
    await ctx.reply('Per favore, invia un\'immagine oppure salta il passaggio.', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Salta', callback_data: 'skip' }]
            ]
        }
    });
}