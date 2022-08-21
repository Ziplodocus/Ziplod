import ExtendedMessage from "../../../../classes/ExtendedMessage.js";
import { speak } from "../../../../utility/sounds.js";

export default async function (msg: ExtendedMessage) {
  const voiceChan = msg.voiceChannel;
  if (!voiceChan) {
    return msg.message.reply(
      "Someone has to be in a voice channel don' they? idiot.",
    );
  }
  if (!msg.args[0]) {
    return msg.message.reply("What must I say oh fascist overlord?");
  }
  const stringToSpeak = msg.args.filter((arg) => !arg.startsWith("<@")).join(
    " ",
  );
  speak(stringToSpeak, voiceChan);
}
