
import { extendMessage } from '../functions/messageHandlers.js';

export const messageCreate = {
	name: 'messageCreate',
	how: 'on',
	execute(message) {
        // Extends the message object with the handlers
        extendMessage(message);
		//If message doesn't begin with the prefix or if the author of the message is the bot then ignore.
        if (!message.isCommand || message.author.bot) {return};
        let eventFunct = message.handlers[message.command];
        eventFunct ? eventFunct() : message.handlers.meme();
	},
};