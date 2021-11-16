
import { playSound } from '../../../helperFunctions/helpers.js';
import { soundTracks } from '../../../data/soundTracks.js';
import { relPathTo } from '../../../helperFunctions/helpers.js';

export function dynamicCommands(message) {
    return () => {
        if ( !soundTracks[message.command] ) return false;
        if (!message.voiceChannel) return message.reply('\n Someone has to be in a voice channel don\'t they? idiot.');
        const rndTrackNo = Math.floor( Math.random() * soundTracks[message.command].count );
        const audioPath = relPathTo(`assets/soundTracks/${message.command}Tracks/${message.command}${rndTrackNo}.mp3`);
        playSound(audioPath, message.voiceChannel);
        return true;
    }
}