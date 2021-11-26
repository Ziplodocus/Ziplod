import { definedCommands } from './commands/definedCommands.js';
import { dynamicCommands } from './commands/dynamicCommands.js';
import { prefix } from '../../data/config.js';
import { EventWhen } from '../events.js';
export const type = EventWhen.on;
export function messageCreate(message) {
    var _a, _b;
    // Extends the message object with the handlers and other utility methods
    extendMessage(message);
    //If message doesn't begin with the prefix or if the author of the message is the bot then ignore.
    if (!message.isCommand || message.author.bot)
        return;
    // Run a predetermined command if it exists, or run the dynamic handler
    ((_b = (_a = message.definedCommands) === null || _a === void 0 ? void 0 : _a[message.command]) === null || _b === void 0 ? void 0 : _b.call(_a))
        || message.dynamicCommand()
        // || console.log( 'That is not one of my many powerful commands, tiny person.' );
        || message.reply('\n That is not one of my many powerful commands tiny person');
}
function extendMessage(message) {
    message.command = message.content.substring(prefix.length).split(' ')[0];
    message.args = message.content.substring(prefix.length + message.command.length + 1).split(' ');
    message.isCommand = message.content.startsWith(prefix);
    message.voiceChannel = (() => {
        var _a, _b;
        const recipient = message.mentions.members.first();
        const author = message.member;
        return ((_a = recipient === null || recipient === void 0 ? void 0 : recipient.voice) === null || _a === void 0 ? void 0 : _a.channel) || ((_b = author === null || author === void 0 ? void 0 : author.voice) === null || _b === void 0 ? void 0 : _b.channel);
    })();
    message.dynamicCommand = dynamicCommands(message);
    message.definedCommands = definedCommands(message);
}
