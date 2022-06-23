import extendedMessage from "../../../../classes/extendedMessage.js";
import { playSound } from "../../../../utility/sounds.js";

export default async ( msg: extendedMessage ) => {
    const voiceChan = msg.voiceChannel();
    if ( !voiceChan )
        return await msg.message.reply(
            "\n Someone has to be in a voice channel don' they? idiot."
        );
    playSound( `./assets/sounds/seinfeld.mp3`, voiceChan );
    return msg;
};