import ExtendedMessage from "../../../../classes/ExtendedMessage.js";
import { delCommands } from "../../../../utility/other.js";
import { playSound } from "../../../../utility/sounds.js";

export default async (msg: ExtendedMessage) => {
  if (msg.message.channel.type !== "GUILD_TEXT") return;
  const voiceChan = msg.voiceChannel;
  const time = voiceChan ? 11000 : 0;
  delCommands(msg.message.channel, time);
  voiceChan && playSound(`exodia`, voiceChan);
  return msg;
};
