// Importing modules
import { Client, Intents } from "discord.js";
import { token, ttsAuth } from "./data/config.js";
import { establishEvents } from "./events/events.js";
import ZiplodStorage from './classes/Storage.js';

// Defining root directory of project
export const ROOT_DIR = new URL( '.', import.meta.url ).pathname.replace( '/', '' );
// Defining constants
const intents = {
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
	]
};

export const client = new Client( intents );
export const Storage = new ZiplodStorage();


console.log( "Launching Ziplod..." );

establishEvents();
Storage.updateTrackCount();

client.login( token );
