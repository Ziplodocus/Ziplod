import { escapeRegExp } from "../utility/other.js";
import { AssetManager, FileManager } from "./FileManager.js";
import { basename } from "path";
import { File } from "@google-cloud/storage";

export class ThemeManager implements AssetManager {
  storage: FileManager;
  cache: Record<string, Record<"intro" | "outro", Set<string>>>;

  constructor(storage: FileManager) {
    this.storage = storage;
    this.cache = {};
  }

  async get(name: string, type: "intro" | "outro", tag: string) {
    const exists = (await this.themes(tag, type)).has(name);

    if (!exists) {
      console.error(`${tag} has no ${type}`);
      return new Error(`${tag} has no ${type}`);
    }

    return this.storage.get(`themes/${tag}/${type}/${name}.mp3`);
  }

  // Uploads a stream to storage bucket in the trackType subfolder in soundtracks
  async add(
    name: string,
    type: "intro" | "outro",
    tag: string,
    stream: NodeJS.ReadableStream,
  ) {
    // Get current cache of user's themes
    const userThemeSongs = await this.themes(tag, type);
    if (userThemeSongs.has(name)) {
      return new Error(`${type} ${name} already exists you gibbon.`);
    }

    // Add the theme if it doesn't already exist
    const file = await this.storage.add(
      `themes/${tag}/${type}/${name}.mp3`,
      stream,
    );

    // Increment the cache so next time it does not need to be checked again
    if (file instanceof File) userThemeSongs.add(name);

    return file;
  }

  // Remove a given theme if it exists
  async remove(name: string, type: "intro" | "outro", tag: string) {
    const userThemesongs = await this.themes(tag, type);
    if (!userThemesongs.has(name)) {
      console.error();
      return new Error();
    }

    const removeResult = await this.storage.remove(
      `themes/${tag}/${type}/${name}.mp3`,
    );

    if (removeResult === true) userThemesongs.delete(name);

    return removeResult;
  }

  async themes(tag: string, type: "intro" | "outro") {
    return this.cache?.[tag]?.[type] || (await this.updateCache(tag))[type];
  }

  // Looks at all the user's themes in the bucket,
  // and updates the cache property based on the files there.
  async updateCache(tag: string) {
    // Fetch details on all user themes
    const allFiles = await this.storage.getAll(`themes/${tag}`);

    // Initialise cache for each theme type at 0
    const tempCache: Record<string, Set<string>> = {
      intro: new Set(),
      outro: new Set(),
    };

    // Increment cacheer for each theme of that type
    allFiles.forEach((file) => {
      // Check whether intro or outro
      const type = new RegExp(`(?<=${escapeRegExp(tag)}/).*?(?=/)`).exec(
        file.name,
      );
      if (type === null) return;
      // Get file name
      const name = basename(file.name, ".mp3");
      if (name === null) return console.error("Something wrong");
      // Add file to the cache
      tempCache[type[0]].add(name);
    });

    // Track the cache on the instance
    this.cache[tag] = tempCache;
    return tempCache;
  }
}
