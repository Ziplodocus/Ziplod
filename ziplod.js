// Importing modules
import { Client, Intents } from 'discord.js';
import { token } from './config.js';
import { events } from './events/events.js';
import { intervalMeme } from './functions/helpers.js';

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

// Adding event listeners
for (const eventType in events) {
	const event = events[eventType];
	client[event.how](eventType, event.execute);
}

intervalMeme();

client.login(token);
