// Importing modules
import { Client, Intents } from 'discord.js';
import { token } from './config.js';
import { setupEventListeners } from './events/events.js';

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

export const client = new Client( intents );

console.log("Launching Ziplod...");

setupEventListeners();

client.login(token);
