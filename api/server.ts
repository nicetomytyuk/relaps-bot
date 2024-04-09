
import { createBot } from "#root/bot/index.js";
import { config } from "#root/config.js";
import { createServer } from "#root/server/index.js";
import { IncomingMessage, ServerResponse } from "node:http";

console.log(config.BOT_TOKEN);
const bot = createBot(config.BOT_TOKEN);
const server = await createServer(bot);

export default async (request: IncomingMessage, response: ServerResponse) => {
  console.log(request);
  await server.ready();
  server.server.emit("request", request, response);
};