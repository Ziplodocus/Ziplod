import ExtendedMessage from "../../../../classes/ExtendedMessage.js";
import { speak } from "../../../../utility/sounds.js";

export default async function (msg: ExtendedMessage) {
  const voiceChan = msg.voiceChannel;
  if (!voiceChan) {
    return msg.message.reply(
      "\n Someone has to be in a voice channel don' they? idiot.",
    );
  }
  const stringToSpeak = msg.args.filter((arg) => !arg.startsWith("<@")).join(
    " ",
  );
  speak(stringToSpeak, voiceChan);
}
