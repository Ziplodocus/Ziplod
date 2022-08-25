import ExtendedMessage from "../../../../classes/ExtendedMessage.js";
import { speak } from "../../../../utility/sounds.js";

export default async function (msg: ExtendedMessage): Promise<void> {
  const voiceChan = msg.voiceChannel;
  console.log(voiceChan);

  // User input validation
  if (!voiceChan) {
    msg.message.reply("Someone has to be in a voice channel don' they? idiot.");
    return;
  }
  if (!msg.args[0]) {
    msg.message.reply("What must I say oh fascist overlord?");
    return;
  }

  // Filter out discord mentions from the text to speak and join rest of args to form the text.
  const stringToSpeak = msg.args.filter((arg) => !arg.startsWith("<@")).join(
    " ",
  );
  speak(stringToSpeak, voiceChan);
  const speakResponse = speak(stringToSpeak, voiceChan);
  if (speakResponse instanceof Error) {
    msg.message.reply(speakResponse.message);
  }
}
