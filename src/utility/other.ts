

import { prefix } from "../data/config.js";
import { client } from "../ziplod.js";
import { TextChannel } from "discord.js";

// Deletes commands the last 50 commands in the given text channel
export function delCommands( channel: TextChannel, time = 11000 ) {
	channel.messages.fetch( { limit: 50 } ).then( ( messages ) => {
		messages
			.filter( message => message.content.startsWith( prefix ) || message.author.client === client )
			.each( message => setTimeout( () => message.delete(), time ) );
	} );
}

// Returns a random time between 5 and 25 minutes
export function randomTime() {
	return 1000 * 60 * 5 + Math.random() * 1000 * 60 * 25;
}