import ExtendedMessage from "../../../../classes/ExtendedMessage.js";
import { playSound } from "../../../../utility/sounds.js";

export default async (msg: ExtendedMessage) => {
  const voiceChan = msg.voiceChannel;
  if (!voiceChan) {
    return await msg.respond(
      "\n Someone has to be in a voice channel don' they? idiot.",
    );
  }
  playSound("seinfeld", voiceChan);
  return msg;
};
