// Importing modules
import { Client, Intents } from "discord.js";
import { token } from "./data/config.js";
import { setUpEvents } from "./events/events.js";
import GoogleStorage from "./classes/Storage.js";

// Defining intents
const intents = {
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
};
export const client = new Client(intents);
export const Storage = new GoogleStorage();

console.log("Launching Ziplod...");

setUpEvents();

client.login(token);
