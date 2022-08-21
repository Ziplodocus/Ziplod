import ExtendedMessage from "../../../../classes/ExtendedMessage.js";
import { Themes } from "../../../../ziplod.js";

export default async (msg: ExtendedMessage) => {
  const tag = msg.message.author.tag;

  const type = msg.args[0];
  if (type !== "intro" && type !== "outro") {
    return msg.respond(
      `${type} is an invalid type of theme music you absolute buffoon. Try intro or outro...`,
    );
  }
  const name = msg.args[1];
  const removeResult = Themes.remove(name, type, tag);
  if (removeResult instanceof Error) {
    msg.respond(removeResult.message);
  } else {
    msg.respond(`Succesfully removed ${type} theme ${name}`);
  }
};
