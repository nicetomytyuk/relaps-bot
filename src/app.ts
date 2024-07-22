#!/usr/bin/env tsx

import { onShutdown } from "node-graceful-shutdown";
import { createServer } from "./server/index.js";
import { config } from "./config.js";
import { createBot } from "./bot/index.js";

try {
  const bot = createBot(config.BOT_TOKEN);
  const server = await createServer(bot);

  process.once("SIGINT", () => bot.stop());
  process.once("SIGTERM", () => bot.stop());  

  // Graceful shutdown
  onShutdown(async () => {
    await server.close();
    await bot.stop();
  });

  await server.listen({
    port: 8000,
  });

  if (config.BOT_MODE === "webhook") {
    // to prevent receiving updates before the bot is ready
    await bot.init();

    await bot.api.setWebhook(config.BOT_WEBHOOK, {
      allowed_updates: config.BOT_ALLOWED_UPDATES,
    });
  } else if (config.BOT_MODE === "polling") {
    await bot.start({
      allowed_updates: config.BOT_ALLOWED_UPDATES
    });
  }
} catch (error) {
  console.log(error);
  process.exit(1);
}
