
import { playSound } from '../../../helperFunctions/helpers.js';
import { soundTracks } from '../../../data/soundTracks.js';
import { relPathTo } from '../../../helperFunctions/helpers.js';
import { extendedMessage } from '../messageCreate.js';

export function dynamicCommands(msg : extendedMessage) {
    return () => {
        if ( !soundTracks[msg.command] ) return false;
        if ( !msg.voiceChannel ) return msg.message.reply('\n Someone has to be in a voice channel don\'t they? idiot.');
        const numbers = msg.args.filter( (arg) => !isNaN( parseInt(arg) ) );
        const commandNumber = Math.abs(parseInt(numbers[0]));
        const trackNo = commandNumber < soundTracks[msg.command].count ?
            commandNumber :
            Math.floor( Math.random() * soundTracks[msg.command].count )
        ;
        const audioPath = relPathTo(`assets/soundTracks/${msg.command}Tracks/${msg.command}${trackNo}.mp3`);
        playSound( audioPath, msg.voiceChannel );
        return true;
    }
}