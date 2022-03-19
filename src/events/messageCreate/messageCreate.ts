
import { EventWhen } from '../events.js';
import { Client, Message } from 'discord.js';
import extendedMessage from '../../classes/extendedMessage.js';

export const type: keyof Client = EventWhen.on;

export function messageCreate( message: Message ) {

    // Extends the message object with the handlers and other utility methods
    const extMessage = new extendedMessage( message );

    // If message doesn't begin with the prefix or if the author of the message is the bot then ignore.
    if ( !extMessage.isCommand || extMessage.message.author.bot ) return;

    // Run the function assocaited with the command
    extMessage.runCommand();
}
