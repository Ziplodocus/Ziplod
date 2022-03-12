import { definedCommands } from './commands/definedCommands.js';
import { dynamicCommands } from './commands/dynamicCommands.js';
import { prefix } from '../../data/config.js';
import { EventWhen } from '../events.js';
import { client } from '../../ziplod.js';
export const type = EventWhen.on;
export function messageCreate(message) {
    var _a;
    // Extends the message object with the handlers and other utility methods
    const extMessage = new extendedMessage(message);
    //If message doesn't begin with the prefix or if the author of the message is the bot then ignore.
    if (!extMessage.isCommand || extMessage.message.author.bot)
        return;
    // Run a predetermined command if it exists, or run the dynamic handler
    ((_a = extMessage.definedCommand) === null || _a === void 0 ? void 0 : _a.call(extMessage))
        || extMessage.dynamicCommand()
        || extMessage.message.reply('\n That is not one of my many powerful commands tiny person');
}
export class extendedMessage {
    constructor(message) {
        this.message = message;
        this.command = message.content.substring(prefix.length).split(' ')[0];
        this.args = message.content.substring(prefix.length + this.command.length + 1).split(' ');
        this.isCommand = message.content.startsWith(prefix);
        this.voiceChannel = (() => {
            var _a, _b, _c, _d, _e, _f;
            const recipientVoiceChan = (_d = (_c = (_b = (_a = message === null || message === void 0 ? void 0 : message.mentions) === null || _a === void 0 ? void 0 : _a.members) === null || _b === void 0 ? void 0 : _b.first()) === null || _c === void 0 ? void 0 : _c.voice) === null || _d === void 0 ? void 0 : _d.channel;
            const authorVoiceChan = (_f = (_e = message.member) === null || _e === void 0 ? void 0 : _e.voice) === null || _f === void 0 ? void 0 : _f.channel;
            const theChannel = recipientVoiceChan || authorVoiceChan;
            return (theChannel === null || theChannel === void 0 ? void 0 : theChannel.type) === 'GUILD_VOICE' ? theChannel : undefined;
        })();
        this.dynamicCommand = () => dynamicCommands(this);
        this.definedCommand = definedCommands(this);
        this.checkPermissions = (permissions) => {
            var _a, _b, _c, _d;
            const guild = this.message.guild;
            const userId = (_a = client === null || client === void 0 ? void 0 : client.user) === null || _a === void 0 ? void 0 : _a.id;
            let userHasPermissions = true;
            let clientHasPermissions = true;
            if (!guild || !userId) {
                this.message.reply("Hmm something has gone wrong here...");
                return false;
            }
            let i = 0;
            while (userHasPermissions && clientHasPermissions) {
                userHasPermissions = !!((_c = (_b = this.message) === null || _b === void 0 ? void 0 : _b.member) === null || _c === void 0 ? void 0 : _c.permissions.has(permissions[i], true));
                clientHasPermissions = !!((_d = guild === null || guild === void 0 ? void 0 : guild.members.cache.get(userId)) === null || _d === void 0 ? void 0 : _d.permissions.has(permissions[i], true));
                i++;
            }
            if (!userHasPermissions)
                this.message.reply("Your privilege has been checked and you have been deemed too pathetic to use this command.");
            else if (!clientHasPermissions)
                this.message.reply("This is rather embarassing but I do not have the power for this...");
            return userHasPermissions && clientHasPermissions;
        };
    }
}
