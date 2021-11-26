// Importing modules
import { Client, Intents } from "discord.js";
import { token } from "./data/config.js";
import { establishEvents } from "./events/events.js";
import { cacheUpdater } from "./cron-jobs/populateSoundTracks.js";
// Defining root directory of project
export const rootDir = new URL('.', import.meta.url).pathname.replace('/', '');
// Defining constants
const intents = {
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
};
export const client = new Client(intents);
console.log("Launching Ziplod...");
establishEvents();
cacheUpdater();
client.login(token);
