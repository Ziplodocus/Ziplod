import { Bucket, Storage } from "@google-cloud/storage";
import { File } from "@google-cloud/storage/build/src/file.js";
import { Readable } from "stream";
import { escapeRegExp } from "../utility/other.js";

// TO DO: Move Theme and track related to own classes ThemeManager, TrackManager ( Potentially subclasses of a AssetManager class?)

// Must have a Google cloud service account key and an env variable
// named GOOGLE_APPLICATION_CREDENTIALS set as the path pointing to the json key.
export default class GoogleStorage {
  bucket: Bucket;
  trackCount: Record<string, number>;
  themeCount: Record<string, Record<string, number>>;
  // Connect to google api and connect to named bucket
  constructor(bucketName = "ziplod-assets") {
    const bucket = new Storage();
    this.bucket = bucket.bucket(bucketName);
    // Assign a track count with the purpose to avoid requesting tracks that don't exist
    this.trackCount = {};
    this.themeCount = {};
    this.updateTrackCount();
  }

  async get(path: string): Promise<Readable | Error> {
    const file = this.bucket.file(path);
    return (await file.exists())[0]
      ? file.createReadStream()
      : new Error("File does not exist!");
  }

  async getAll(prefix: string): Promise<File[]> {
    const res = await this.bucket.getFiles({
      autoPaginate: false,
      prefix,
    });
    return res[0];
  }

  async add(
    path: string,
    stream: NodeJS.ReadableStream,
  ): Promise<File | Error> {
    const file = this.bucket.file(path);
    const exists = (await file.exists())[0];
    if (new RegExp("s/[^A-Za-z0-9.-]/_/").test(path)) {
      return new Error("That's an unnaceptable command name 👺");
    }
    if (exists) return new Error("File already exists");
    stream.pipe(file.createWriteStream());
    return file;
  }

  // Uploads a stream to storage bucket in the trackType subfolder in soundtracks
  async addTrack(
    type: string,
    stream: NodeJS.ReadableStream,
  ): Promise<File | Error> {
    const number = this.trackCount[type] || 0;
    console.log(`Registering track ${type}${number}...`);
    const filename = `soundTracks/${type}Tracks/${type}${number}.mp3`;

    const file = await this.add(filename, stream);
    if (file instanceof Error) return file;

    this.trackCount[type]++;
    console.log(`Registered ${type}${number} succesfully.`);

    return file;
  }

  // Looks at all the files in the soundTracks bucket,
  // and updates the trackCount property based on the files there.
  async updateTrackCount(): Promise<Record<string, number>> {
    const allFiles = await this.getAll("soundTracks/");
    const tempCount: Record<string, number> = {};
    allFiles.forEach((file) => {
      const trackType = new RegExp("(?<=/).*(?=Tracks/)").exec(file.name);
      if (!Array.isArray(trackType)) return;
      tempCount[trackType[0]]
        ? (tempCount[trackType[0]]++)
        : (tempCount[trackType[0]] = 1);
    });
    this.trackCount = tempCount;
    return this.trackCount;
  }

  async addTheme(
    userTag: string,
    type: string,
    stream: NodeJS.ReadableStream,
  ): Promise<File | Error> {
    // Get current count of user's themes
    const count = this.themeCount?.[userTag] ||
      await this.checkThemeCount(userTag);
    const num = count[type];
    const filename = `soundTracks/themeSongs/${userTag}/${type}-${num}.mp3`;

    console.log(`Attempting to register ${type}-${num}...`);
    const file = await this.add(filename, stream);

    // Increment the count so next time it does not need to be checked again
    if (file instanceof File) this.themeCount[userTag][type]++;

    return file;
  }

  async checkThemeCount(userTag: string): Promise<Record<string, number>> {
    // Fetch details on all user themes
    const allFiles = await this.getAll(`soundTracks/themeSongs/${userTag}`);

    // Initialise count for each theme type at 0
    const tempCount: Record<string, number> = {
      intro: 0,
      outro: 0,
    };

    // Increment counter for each theme of that type
    allFiles.forEach((file) => {
      const type = new RegExp(`(?<=${escapeRegExp(userTag)}/).*?(?=-)`).exec(
        file.name,
      );
      if (!Array.isArray(type)) return;
      tempCount[type[0]]++;
    });

    // Track the count on the instance
    this.themeCount[userTag] = tempCount;
    return this.themeCount[userTag];
  }
}
