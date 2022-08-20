import ExtendedMessage from "../../../../classes/ExtendedMessage.js";
import { Storage } from "../../../../ziplod.js";

export default async (msg: ExtendedMessage) => {
  const obj = await Storage.checkThemeCount(msg.message.author.tag);
  msg.message.reply(
    `Your have ${obj.intro} intro(s) and ${obj.outro} outro(s)`,
  );
  return msg;
};
