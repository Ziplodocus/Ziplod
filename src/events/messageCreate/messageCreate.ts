import { EventWhen } from "../events.js";
import { Client, Message } from "discord.js";
import ExtendedMessage from "../../classes/ExtendedMessage.js";
import { Storage } from "../../ziplod.js";
import playTrack from "./commands/playTrack.js";

export const type: keyof Client = EventWhen.on;

export async function messageCreate(message: Message) {
  // Extends the message object with the handlers and other utility methods
  const extMsg = new ExtendedMessage(message);

  // If message doesn't begin with the prefix or if the author of the message is the bot then ignore.
  if (!extMsg.isCommand || extMsg.message.author.bot) return;

  // Try importing the defined command, if it doesn't exist then check if track exists and pay the track
  try {
    const { default: command } = await import(
      `./commands/defined/${extMsg.command}.js`
    );
    return command(extMsg);
  } catch (e) {
  }
  if (Storage.trackCount[extMsg.command]) return playTrack(extMsg);
  message.reply("\n That is not one of my many powerful commands tiny person");
}
