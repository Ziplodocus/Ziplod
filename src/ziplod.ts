// Importing modules
import { Client, Intents } from "discord.js";
import { token } from "./data/config.js";
import { setUpEvents } from "./events/events.js";
import { FileManager } from "./classes/FileManager.js";
import { TrackManager } from "./classes/TrackManager.js";
import { ThemeManager } from "./classes/ThemeManager.js";
import { Storage } from "@google-cloud/storage";
import { EncounterManager } from "./gameplay/classes/EncounterManager.js";
import { Attribute } from "@ziplodocus/zumbor-types";

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

export const GoogleStorage = new Storage();

export const Files = new FileManager(GoogleStorage.bucket("ziplod-assets"));

export const Tracks = new TrackManager(Files);
export const Themes = new ThemeManager(Files);

console.log("Launching Ziplod...");

setUpEvents();

client.login(token);
