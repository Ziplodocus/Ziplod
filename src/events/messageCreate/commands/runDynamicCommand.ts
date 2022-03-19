
import { playSound } from '../../../helperFunctions/helpers';
import { soundTracks } from '../../../cron-jobs/soundTracks';
import { relPathTo } from '../../../helperFunctions/helpers';
import extendedMessage from '../../../classes/extendedMessage';

export default ( msg: extendedMessage ) => {
    const voiceChan = msg.voiceChannel();
    if ( !soundTracks[msg.command] ) return false;
    if ( !voiceChan ) {
        msg.message.reply( '\n Someone has to be in a voice channel, don\'t they? idiot.' );
        return false;
    }

    // Filters args to only numbers
    const numbers = msg.args.filter( ( arg ) => !isNaN( parseInt( arg ) ) );

    // If the track number exists play that one else play a random track
    const commandNumber = Math.abs( parseInt( numbers[0] ) );
    const trackNo = commandNumber < soundTracks[msg.command].count ?
        commandNumber :
        Math.floor( Math.random() * soundTracks[msg.command].count );
    const audioPath = relPathTo( `assets/soundTracks/${msg.command}Tracks/${msg.command}${trackNo}.mp3` );
    playSound( audioPath, voiceChan );
    return true;
};