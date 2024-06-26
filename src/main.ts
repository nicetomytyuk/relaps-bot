#!/usr/bin/env tsx

import { onShutdown } from "node-graceful-shutdown";
import { createBot } from "#root/bot/index.js";
import { config } from "#root/config.js";
import { createServer } from "#root/server/index.js";

try {
  const bot = createBot(config.BOT_TOKEN);
  const server = await createServer(bot);

  // Graceful shutdown
  onShutdown(async () => {
    await server.close();
    await bot.stop();
  });

  if (config.BOT_MODE === "webhook") {
    // to prevent receiving updates before the bot is ready
    await bot.init();

    await server.listen({
      host: config.BOT_SERVER_HOST,
      port: config.BOT_SERVER_PORT,
    });

    await bot.api.setWebhook(config.BOT_WEBHOOK, {
      allowed_updates: config.BOT_ALLOWED_UPDATES,
    });
  } else if (config.BOT_MODE === "polling") {
    await bot.start({
      allowed_updates: config.BOT_ALLOWED_UPDATES
    });
  }
} catch (error) {
  process.exit(1);
}
