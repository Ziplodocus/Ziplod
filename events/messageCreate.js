
import { definedCommands } from './messageCreate/commands/definedCommands.js';
import { dynamicCommands } from './messageCreate/commands/dynamicCommands.js'
import { prefix } from '../data/config.js';

export const messageCreate = {
	name: 'messageCreate',
	how: 'on',
	execute(message) {
        // Extends the message object with the handlers and other utility methods
        extendMessage(message);
		//If message doesn't begin with the prefix or if the author of the message is the bot then ignore.
        if (!message.isCommand || message.author.bot) return;
        // Run a predetermined command if it exists, or run the dynamic handler
        message.definedCommands?.[message.command]?.()
        || message.dynamicCommand()
        || console.log('That is not one of my many powerful commands, tiny person.');
        //|| message.reply('\n That is not one of my many powerful commands tiny person');
	},
};

function extendMessage(message) {
    message.command = message.content.substring(prefix.length).split(' ')[0];
    message.args = message.content.substring(prefix.length + message.command.length + 1).split(' ');
    message.isCommand = message.content.startsWith(prefix);
    message.voiceChannel = ( () => {
        const recipient = message.mentions.members.first();
        const author = message.member;
        return recipient?.voice?.channel || author?.voice?.channel;
    } )()
    message.dynamicCommand = dynamicCommands(message);
    message.definedCommands = definedCommands(message);
}