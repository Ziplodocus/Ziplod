import ExtendedMessage from "../../../../classes/ExtendedMessage";
import fetch from "node-fetch";
import { Themes, Tracks } from "../../../../ziplod.js";
import { basename } from "path";

export default async (msg: ExtendedMessage) => {
  const attachment = msg.message.attachments.first();
  const type = msg.args[0];
  if (!type) return msg.message.reply("Register as what you neanderthal?");
  if (!attachment) return msg.message.reply("Attach an mp3 dimwit.");
  if (attachment.size > 2000000) {
    return msg.message.reply(
      "File is larger than your mother, I will not take it.",
    );
  }
  if (attachment.contentType !== "audio/mpeg") {
    return msg.message.reply("I only take mp3s you dissident.");
  }

  try {
    // fetch the file from the external URL
    const response = await fetch(attachment.url);

    // Add the track to google cloud storage
    if (type === "intro" || type === "outro") {
      const name = msg.args[1];
      if (!name) {
        return msg.message.reply(
          "Your theme song needs a (one word) name! I recommend 'moron'.",
        );
      }
      if (attachment.size > 347520) {
        return msg.message.reply(
          "No one wants to hear your life story. Keep it short and sweet.",
        );
      }
      const res = await Themes.add(
        name,
        type,
        msg.message.author.tag,
        response.body,
      );
      if (res instanceof Error) {
        msg.message.reply(`Unsuccessfully registered ${name}...`);
      } else {
        msg.message.reply(
          `Succesfully registered theme as ${basename(res.name, ".mp3")}`,
        );
      }
      return;
    }

    const res = await Tracks.add(type, response.body);
    if (res instanceof Error) msg.message.reply(res.message);
    else {
      msg.message.reply(
        `Succesfully registered track ${basename(res.name, ".mp3")}`,
      );
    }
    return;
  } catch (error) {
    console.error(error);
    msg.message.channel.send(
      "Something has gone wrong... Totally not my fault though.",
    );
    return;
  }
};
