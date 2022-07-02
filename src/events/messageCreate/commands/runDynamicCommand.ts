
import { playAudioStream } from '../../../utility/sounds.js';
import ExtendedMessage from '../../../classes/ExtendedMessage.js';
import {Storage} from '../../../ziplod.js';

export default async ( msg: ExtendedMessage ) => {
    const voiceChan = msg.voiceChannel();
    if ( !Storage.trackCount[msg.command] ) return false;
    if ( !voiceChan ) {
        msg.message.reply( '\n Someone has to be in a voice channel, don\'t they? idiot.' );
        return true;
    }

    // Filters args to only numbers
    const numbers = msg.args.filter( ( arg ) => !isNaN( parseInt( arg ) ) );

    // If the track number exists play that one else play a random track
    const commandNumber = Math.abs( parseInt( numbers[0] ) );
    const trackNo = commandNumber < Storage.trackCount[msg.command] ?
        commandNumber :
        Math.floor( Math.random() * Storage.trackCount[msg.command] );
    const audioStream = await Storage.getTrack(msg.command, trackNo);
    playAudioStream(audioStream, voiceChan);
    return true;
};