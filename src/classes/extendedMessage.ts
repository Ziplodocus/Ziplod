import { Message, VoiceChannel } from "discord.js";
import { prefix } from "../data/config.js";
import runDefinedCommand from "../events/messageCreate/commands/runDefinedCommand.js";
import runDynamicCommand from "../events/messageCreate/commands/runDynamicCommand.js";

export default class {
    command: string;
    args: string[];
    isCommand: boolean;
    voiceChannel: () => VoiceChannel | undefined;
    message: Message;
    runCommand: () => void;
    constructor( message: Message ) {
        this.message = message;
        this.command = message.content.substring( prefix.length ).split( ' ' )[0];
        this.args = message.content.substring( prefix.length + this.command.length + 1 ).split( ' ' );
        this.isCommand = message.content.startsWith( prefix );
        this.voiceChannel = () => {
            const recipientVoiceChan = message?.mentions?.members?.first()?.voice?.channel;
            const authorVoiceChan = message.member?.voice?.channel;
            const theChannel = recipientVoiceChan || authorVoiceChan;
            return theChannel?.type === 'GUILD_VOICE' ? theChannel : undefined;
        };
        this.runCommand = () => {
            runDefinedCommand( this )
                || runDynamicCommand( this )
                || this.message.reply( '\n That is not one of my many powerful commands tiny person' );
        };
    }
}