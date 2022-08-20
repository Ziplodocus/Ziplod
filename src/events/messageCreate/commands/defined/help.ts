import ExtendedMessage from "../../../../classes/ExtendedMessage.js";
import { Tracks } from "../../../../ziplod.js";

export default async (msg: ExtendedMessage) => {
  const tracks = Tracks.count;
  let commands = "";
  for (const com of Object.keys(tracks)) {
    commands += `\n ✸ ${com} : ${tracks[com] - 1}`;
  }
  msg.message.channel.send(`The following tracks are available:${commands}`);
  return msg;
};
