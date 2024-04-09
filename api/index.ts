
import { webhookCallback } from "grammy";
import bot from "../src/index"

function runMiddleware(req: Request, res: Response, fn: any) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }

            return resolve(result);
        });
    });
}

async function handler(req: Request, res: Response) {
    // Run the middleware
    await runMiddleware(req, res, webhookCallback(bot));
}

export default handler;