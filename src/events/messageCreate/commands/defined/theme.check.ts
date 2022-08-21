import ExtendedMessage from "../../../../classes/ExtendedMessage.js";
import { Themes } from "../../../../ziplod.js";

export default async (msg: ExtendedMessage) => {
  const intros = await Themes.themes(msg.message.author.tag, "intro");
  const outros = await Themes.themes(msg.message.author.tag, "outro");

  let reply = "Here are your current themes... \nIntros:";
  for (let theme of intros) {
    reply += `\n\t- ${theme}`;
  }
  reply += "\nOutros:";
  for (let theme of outros) {
    reply += `\n\t- ${theme}`;
  }

  msg.respond(reply);
  return msg;
};
