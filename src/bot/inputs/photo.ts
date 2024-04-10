import { EventBuilder } from "../models/event-builder.js";

export async function photoInput(ctx: any, text: string | null): Promise<void> {
    const builder = ctx.session.builder as EventBuilder;

    if (text === null) {
        builder.setPhotoId(null);
        await ctx.reply('Inserisci la data dell\'evento (es., 11/02/2024):');
        return;
    }else if ('photo' in ctx.message) {
        const photo = ctx.message.photo;
        if (photo) {
            builder.setPhotoId(photo[photo.length - 1].file_id);
        }
        await ctx.reply('Inserisci la data dell\'evento (es., 11/02/2024):');
        return;
    }
    
    await ctx.reply('Per favore, invia un\'immagine oppure salta il passaggio.');
}