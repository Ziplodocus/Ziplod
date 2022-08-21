import { readdirSync } from "fs";
import { prefix } from "../data/config.js";
import { client } from "../ziplod.js";
import { TextChannel } from "discord.js";

// Deletes commands the last 50 commands in the given text channel
export function delCommands(channel: TextChannel, time = 11000) {
  channel.messages.fetch({ limit: 50 }).then((messages) => {
    messages
      .filter((message) =>
        message.content.startsWith(prefix) || message.author.client === client
      )
      .each((message) => setTimeout(() => message.delete(), time));
  });
}

// Returns a random time between 5 and 25 minutes
export function randomTime() {
  return 1000 * 60 * 5 + Math.random() * 1000 * 60 * 25;
}

// Escape a string for use in regex
export function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

// Retrieves all directories within the given directory
export function getDirs(dirPath: string) {
  return readdirSync(dirPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

export function randItem<T>(set: Set<T>) {
  const i = Math.floor(Math.random() * set.size);
  let j = 0;
  for (const item of set) {
    if (j === i) {
      return item;
    }
    j++;
  }
}
