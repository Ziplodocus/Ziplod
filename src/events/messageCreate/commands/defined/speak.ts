import ExtendedMessage from "../../../../classes/ExtendedMessage.js";
import { speak } from "../../../../utility/sounds.js";

export default async function (msg: ExtendedMessage): Promise<void> {
  const voiceChan = msg.voiceChannel;

  // User input validation
  if (!voiceChan) {
    msg.respond(
      "Someone has to be in a voice channel don' they? idiot.",
    );
    return;
  }
  if (!msg.args[0]) {
    msg.respond("What must I say oh fascist overlord?");
    return;
  }

  // Filter out discord mentions from the text to speak and join rest of args to form the text.
  const stringToSpeak = msg.args.filter((arg) => !arg.startsWith("<@")).join(
    " ",
  );
  const speakResponse = speak(stringToSpeak, voiceChan);
  if (speakResponse instanceof Error) {
    msg.respond(speakResponse.message);
  }
}
