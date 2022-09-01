import ExtendedMessage from "../../../../classes/ExtendedMessage.js";
import { Tracks } from "../../../../ziplod.js";
import { getDefinedCommandNames } from "../../../../utility/other.js";

export default async (msg: ExtendedMessage) => {
  const defCommands = getDefinedCommandNames(
    "events/messageCreate/commands/defined/",
  );
  let commands = "";
  for (const key in Tracks.count) {
    commands += `\n✸     ${key} - ${Tracks.count[key]}`;
  }

  msg.message.channel.send(
    `**The following commands are available:**\n✸     ${
      defCommands.join("\n✸     ")
    }${commands}`,
  );
  return msg;
};
