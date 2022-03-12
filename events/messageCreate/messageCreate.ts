
import { definedCommands } from './commands/definedCommands.js';
import { dynamicCommands } from './commands/dynamicCommands.js'
import { prefix } from '../../data/config.js';
import { EventWhen } from '../events.js';
import { Client, GuildMember, Message, StageChannel, VoiceChannel } from 'discord.js';

export const type: keyof Client = EventWhen.on;

export function messageCreate(message: Message) {
    // Extends the message object with the handlers and other utility methods
    const extMessage = new extendedMessage(message);
    //If message doesn't begin with the prefix or if the author of the message is the bot then ignore.
    if (!extMessage.isCommand || extMessage.message.author.bot) return;
    // Run a predetermined command if it exists, or run the dynamic handler
    extMessage.definedCommands?.(extMessage.command)?.()
        || extMessage.dynamicCommand()
        // || console.log( 'That is not one of my many powerful commands, tiny person.' );
        || extMessage.message.reply('\n That is not one of my many powerful commands tiny person');
}

export class extendedMessage {
    command: String
    args: String[]
    isCommand: boolean
    voiceChannel: VoiceChannel | StageChannel | null | undefined
    dynamicCommand: Function
    definedCommands: Function
    message: Message
    constructor(message: Message) {
        this.message = message;
        this.command = message.content.substring(prefix.length).split(' ')[0];
        this.args = message.content.substring(prefix.length + this.command.length + 1).split(' ');
        this.isCommand = message.content.startsWith(prefix);
        this.voiceChannel = (() => {
            const recipient: GuildMember | undefined | null = message?.mentions?.members?.first();
            const author = message.member;
            return recipient?.voice?.channel || author?.voice?.channel;
        })()
        this.dynamicCommand = () => dynamicCommands(message);
        this.definedCommands = definedCommands(message);
    }
}
