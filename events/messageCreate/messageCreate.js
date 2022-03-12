import { definedCommands } from './commands/definedCommands.js';
import { dynamicCommands } from './commands/dynamicCommands.js';
import { prefix } from '../../data/config.js';
import { EventWhen } from '../events.js';
export const type = EventWhen.on;
export function messageCreate(message) {
    var _a, _b;
    // Extends the message object with the handlers and other utility methods
    const extMessage = new extendedMessage(message);
    //If message doesn't begin with the prefix or if the author of the message is the bot then ignore.
    if (!extMessage.isCommand || extMessage.message.author.bot)
        return;
    // Run a predetermined command if it exists, or run the dynamic handler
    ((_b = (_a = extMessage.definedCommands) === null || _a === void 0 ? void 0 : _a.call(extMessage, extMessage.command)) === null || _b === void 0 ? void 0 : _b())
        || extMessage.dynamicCommand()
        // || console.log( 'That is not one of my many powerful commands, tiny person.' );
        || extMessage.message.reply('\n That is not one of my many powerful commands tiny person');
}
export class extendedMessage {
    constructor(message) {
        this.message = message;
        this.command = message.content.substring(prefix.length).split(' ')[0];
        this.args = message.content.substring(prefix.length + this.command.length + 1).split(' ');
        this.isCommand = message.content.startsWith(prefix);
        this.voiceChannel = (() => {
            var _a, _b, _c, _d;
            const recipient = (_b = (_a = message === null || message === void 0 ? void 0 : message.mentions) === null || _a === void 0 ? void 0 : _a.members) === null || _b === void 0 ? void 0 : _b.first();
            const author = message.member;
            return ((_c = recipient === null || recipient === void 0 ? void 0 : recipient.voice) === null || _c === void 0 ? void 0 : _c.channel) || ((_d = author === null || author === void 0 ? void 0 : author.voice) === null || _d === void 0 ? void 0 : _d.channel);
        })();
        this.dynamicCommand = () => dynamicCommands(message);
        this.definedCommands = definedCommands(message);
    }
}
