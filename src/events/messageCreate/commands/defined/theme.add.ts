import ExtendedMessage from "../../../../classes/ExtendedMessage.js";
import { Themes } from "../../../../ziplod.js";
import { basename } from "path";
import fetch from "node-fetch";

export default async (msg: ExtendedMessage) => {
  const attachment = msg.message.attachments.first();
  const type = msg.args[0];
  const name = msg.args[1];

  // Validation of user inputs
  if (type !== "intro" && type !== "outro") {
    return msg.respond(
      "Register as what you neanderthal? intro or outro?",
    );
  }
  if (!attachment) return msg.respond("Attach an mp3 dimwit.");
  if (!name) {
    return msg.respond(
      "Your theme song needs a (one word) name! I recommend 'moron'.",
    );
  }
  if (attachment.contentType !== "audio/mpeg") {
    return msg.respond("I only take mp3s you dissident.");
  }
  if (attachment.size > 347520) {
    return msg.respond(
      "No one wants to hear your life story. Keep it short and sweet.",
    );
  }

  // Get the attachment and add to user themes under the given name
  const response = await fetch(attachment.url);
  const res = await Themes.add(
    name,
    type,
    msg.message.author.tag,
    response.body,
  );
  // Handle user message based on success or error
  if (res instanceof Error) {
    msg.respond(`Unsuccessfully registered ${name}...`);
  } else {
    msg.respond(
      `Succesfully registered theme as ${basename(res.name, ".mp3")}`,
    );
  }
};
