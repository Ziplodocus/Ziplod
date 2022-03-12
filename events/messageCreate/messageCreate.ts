
import { definedCommands } from './commands/definedCommands.js';
import { dynamicCommands } from './commands/dynamicCommands.js';
import { prefix } from '../../data/config.js';
import { EventWhen } from '../events.js';
import { Client, Message, PermissionResolvable, VoiceChannel } from 'discord.js';
import { client } from '../../ziplod.js';

export const type: keyof Client = EventWhen.on;

export function messageCreate( message: Message ) {
    // Extends the message object with the handlers and other utility methods
    const extMessage = new extendedMessage( message );
    //If message doesn't begin with the prefix or if the author of the message is the bot then ignore.
    if ( !extMessage.isCommand || extMessage.message.author.bot ) return;
    // Run a predetermined command if it exists, or run the dynamic handler
    extMessage.definedCommand?.()
        || extMessage.dynamicCommand()
        || extMessage.message.reply( '\n That is not one of my many powerful commands tiny person' );
}

export class extendedMessage {
    command: string;
    args: string[];
    isCommand: boolean;
    voiceChannel: VoiceChannel | null | undefined;
    dynamicCommand: Function;
    definedCommand: Function | undefined;
    message: Message;
    checkPermissions: Function;
    constructor( message: Message ) {
        this.message = message;
        this.command = message.content.substring( prefix.length ).split( ' ' )[0];
        this.args = message.content.substring( prefix.length + this.command.length + 1 ).split( ' ' );
        this.isCommand = message.content.startsWith( prefix );
        this.voiceChannel = ( () => {
            const recipientVoiceChan = message?.mentions?.members?.first()?.voice?.channel;
            const authorVoiceChan = message.member?.voice?.channel;
            const theChannel = recipientVoiceChan || authorVoiceChan;
            return theChannel?.type === 'GUILD_VOICE' ? theChannel : undefined;
        } )();
        this.dynamicCommand = dynamicCommands( this );
        this.definedCommand = definedCommands( this );
        this.checkPermissions = ( permissions: PermissionResolvable[] ) => {
            const guild = this.message.guild;
            const userId = client?.user?.id;
            let userHasPermissions = true;
            let clientHasPermissions = true;
            if ( !guild || !userId ) {
                this.message.reply( "Hmm something has gone wrong here..." );
                return false;
            }
            let i = 0;
            while ( userHasPermissions && clientHasPermissions ) {
                userHasPermissions = !!this.message?.member?.permissions.has( permissions[i], true );
                clientHasPermissions = !!guild?.members.cache.get( userId )?.permissions.has( permissions[i], true );
                i++;
            }
            if ( !userHasPermissions ) this.message.reply( "Your privilege has been checked and you have been deemed too pathetic to use this command." );
            else if ( !clientHasPermissions ) this.message.reply( "This is rather embarassing but I do not have the power for this..." );
            return userHasPermissions && clientHasPermissions;
        };
    }
}
