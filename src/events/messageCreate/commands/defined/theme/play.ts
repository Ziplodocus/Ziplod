import ExtendedMessage from "../../../../../classes/ExtendedMessage.js";
import { playTheme } from "../../../../../utility/sounds.js";

export default async (msg: ExtendedMessage): Promise<void> => {
  const voiceState = msg.message.member?.voice;
  if (!voiceState) {
    msg.message.reply("Get in a voice channel idot");
    return;
  }
  if (msg.args[0] !== "intro" && msg.args[0] !== "outro") {
    msg.message.reply("Try specifying intro or outro dimwit");
    return;
  }
  const playResult = await playTheme(voiceState, msg.args[0], msg.args[1]);
  if (playResult instanceof Error) {
    msg.message.reply(playResult.message);
  }
};
