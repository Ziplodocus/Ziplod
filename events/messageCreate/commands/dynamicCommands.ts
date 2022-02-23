
import { playSound } from '../../../helperFunctions/helpers.js';
import { soundTracks } from '../../../data/soundTracks.js';
import { relPathTo } from '../../../helperFunctions/helpers.js';
import { Message } from 'discord.js';

export function dynamicCommands(message : Message) {
    return () => {
        if ( !soundTracks[message.command] ) return false;
        if ( !message.voiceChannel ) return message.reply('\n Someone has to be in a voice channel don\'t they? idiot.');
        const numbers = message.args.filter( (arg) => !isNaN( parseInt(arg) ) );
        const commandNumber = Math.abs(parseInt(numbers[0]));
        const trackNo = commandNumber < soundTracks[message.command].count ?
            commandNumber :
            Math.floor( Math.random() * soundTracks[message.command].count )
        ;
        const audioPath = relPathTo(`assets/soundTracks/${message.command}Tracks/${message.command}${trackNo}.mp3`);
        playSound( audioPath, message.voiceChannel );
        return true;
    }
}