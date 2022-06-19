// Importing modules
import { Client, Intents } from "discord.js";
import { token, textToSpeechAuth } from "./data/config.js";
import { establishEvents } from "./events/events.js";
import { soundTracksUpdater } from "./cron-jobs/soundTracks.js";
import fetch from 'node-fetch';
import fs from 'fs';

// Defining root directory of project
export const rootDir = new URL( '.', import.meta.url ).pathname.replace( '/', '' );
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

console.log( "Launching Ziplod..." );

establishEvents();
soundTracksUpdater();

client.login( token );
