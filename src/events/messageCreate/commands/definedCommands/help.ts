import extendedMessage from "../../../../classes/extendedMessage";
import { playSound } from "../../../../helperFunctions/helpers";

export default ( msg: extendedMessage ) => {
    const voiceChan = msg.voiceChannel();
    if ( !voiceChan )
        return msg.message.reply( "\n Someone has to be in a voice channel don' they? idiot." );
    playSound( `./assets/sounds/seinfeld.mp3`, voiceChan );
    return msg;
};