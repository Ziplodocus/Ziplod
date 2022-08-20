import { escapeRegExp } from "../utility/other.js";
import GoogleStorage from "./Storage.js";

export default class ThemeManager {
  storage: GoogleStorage;
  count: Record<string, Record<"intro" | "outro", number>>;

  constructor(storage: GoogleStorage) {
    this.storage = storage;
    this.count = {};
  }

  async get(tag: string, type: "intro" | "outro", num?: number) {
    const count = await this.getCount(tag);

    if (count[type] === 0) {
      console.error(`${tag} has no ${type}`);
      return new Error(`${tag} has no ${type}`);
    }

    const themeNumber = (num && num < count[type])
      ? num
      : Math.floor(Math.random() * count[type]);

    console.log(`Getting ${tag}'s ${type}-${themeNumber}...`);
    const getResult = this.storage.get(
      `soundTracks/themeSongs/${tag}/${type}-${themeNumber}.mp3`,
    );
    if (getResult instanceof Error) {
      console.error(
        `Failed to retrieve ${tag}'s ${type} music : ${getResult.message}`,
      );
    }
    return getResult;
  }

  // Uploads a stream to storage bucket in the trackType subfolder in soundtracks
  async add(
    tag: string,
    type: "intro" | "outro",
    stream: NodeJS.ReadableStream,
  ) {
    // Get current count of user's themes
    const count = await this.getCount(tag);
    const num = count[type];

    console.log(`Attempting to register ${type}-${num}...`);
    const file = await this.storage.add(
      `soundTracks/themeSongs/${tag}/${type}-${num}.mp3`,
      stream,
    );

    // Increment the count so next time it does not need to be checked again
    if (file instanceof File) this.count[tag][type]++;

    return file;
  }

  // Looks at all the files in the soundTracks bucket,
  // and updates the count property based on the files there.
  async updateCount(tag: string): Promise<Record<string, number>> {
    // Fetch details on all user themes
    const allFiles = await this.storage.getAll(`soundTracks/themeSongs/${tag}`);

    // Initialise count for each theme type at 0
    const tempCount: Record<string, number> = {
      intro: 0,
      outro: 0,
    };

    // Increment counter for each theme of that type
    allFiles.forEach((file) => {
      const type = new RegExp(`(?<=${escapeRegExp(tag)}/).*?(?=-)`).exec(
        file.name,
      );
      if (type === null) return;
      tempCount[type[0]]++;
    });

    // Track the count on the instance
    this.count[tag] = tempCount;
    return this.count[tag];
  }

  getCount = async (tag: string) => {
    return this.count?.[tag] ||
      await this.updateCount(tag);
  };
}
