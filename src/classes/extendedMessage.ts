import { Message } from "discord.js";
import { prefix } from "../data/config.js";
import runDefinedCommand from "../events/messageCreate/commands/runDefinedCommand.js";
import runDynamicCommand from "../events/messageCreate/commands/runDynamicCommand.js";

export default class {
    command: string;
    args: string[];
    isCommand: boolean;
    message: Message;
    constructor( message: Message ) {
        this.message = message;
        this.command = message.content.substring( prefix.length ).toLowerCase().split( ' ' )[0];
        this.args = message.content.substring( prefix.length + this.command.length + 1 ).toLowerCase().split( ' ' );
        this.isCommand = message.content.startsWith( prefix );
    }
    voiceChannel() {
        const recipientVoiceChan = this.message?.mentions?.members?.first()?.voice?.channel;
        const authorVoiceChan = this.message.member?.voice?.channel;
        const theChannel = recipientVoiceChan || authorVoiceChan;
        return theChannel?.type === 'GUILD_VOICE' ? theChannel : null;
    };
    async runCommand() {
        ( await runDefinedCommand( this ) ) ||
        ( await runDynamicCommand( this ) ) ||
        this.message.reply( '\n That is not one of my many powerful commands tiny person' );
    };
}