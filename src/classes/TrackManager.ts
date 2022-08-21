import { File } from "@google-cloud/storage";
import { AssetManager, FileManager } from "./FileManager";

export class TrackManager implements AssetManager {
  storage: FileManager;
  count: Record<string, number>;

  constructor(storage: FileManager) {
    this.storage = storage;
    this.count = {};
    this.updateCount();
  }

  async get(type: string, num: number) {
    const path = `tracks/${type}/${num}.mp3`;
    const stream = await this.storage.get(path);
    return stream;
  }

  // Uploads a stream to storage bucket in the trackType subfolder in soundtracks
  async add(
    type: string,
    stream: NodeJS.ReadableStream,
  ) {
    const number = this.count[type] || 0;
    const filename = `tracks/${type}/${number}.mp3`;

    const file = await this.storage.add(filename, stream);
    if (file instanceof File) this.count[type]++;
    return file;
  }

  // TODO: Implement
  async remove(type: string) {
    return new Error("Hmm");
  }

  // Looks at all the files in the soundTracks bucket,
  // and updates the count property based on the files there.
  async updateCount(): Promise<Record<string, number>> {
    const allFiles = await this.storage.getAll("tracks/");
    const tempCount: Record<string, number> = {};
    allFiles.forEach((file) => {
      const trackType = new RegExp("(?<=tracks/).*(?=/)").exec(file.name);
      if (!Array.isArray(trackType)) return;
      tempCount[trackType[0]]
        ? (tempCount[trackType[0]]++)
        : (tempCount[trackType[0]] = 1);
    });
    this.count = tempCount;
    return this.count;
  }
}
