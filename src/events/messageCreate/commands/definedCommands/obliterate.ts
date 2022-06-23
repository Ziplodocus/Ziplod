import extendedMessage from "../../../../classes/extendedMessage.js";
import { delCommands } from "../../../../utility/other.js";
import { playSound } from "../../../../utility/sounds.js";

export default async ( msg: extendedMessage ) => {
    if ( msg.message.channel.type !== "GUILD_TEXT" ) return;
    const voiceChan = msg.voiceChannel();
    const time = voiceChan ? 11000 : 0;
    delCommands( msg.message.channel, time );
    voiceChan && playSound( `./assets/sounds/exodia.mp3`, voiceChan );
    return msg;
};