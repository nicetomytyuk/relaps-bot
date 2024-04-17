import { Update } from "@grammyjs/types";
import { Context, Middleware } from "grammy";

export function logger(): Middleware<Context> {
    return async (ctx, next) => {
      ctx.api.config.use((previous, method, payload, signal) => {
        console.log("BOT API CALL:", method, payload);
        return previous(method, payload, signal);
      });
  
      console.log("UPDATE RECEIVED:", getUpdateInfo(ctx));
  
      const startTime = performance.now();
      try {
        await next();
      } finally {
        const endTime = performance.now();
        console.log("UPDATE PROCESSED:", endTime - startTime);
      }
    };
  }

  export function getUpdateInfo(ctx: Context): Omit<Update, "update_id"> {
    // eslint-disable-next-line camelcase, @typescript-eslint/no-unused-vars
    const { update_id, ...update } = ctx.update;
  
    return update;
  }