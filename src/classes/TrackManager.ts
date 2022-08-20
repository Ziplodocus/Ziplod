import GoogleStorage from "./Storage";

export default class TrackManager {
  storage: GoogleStorage;
  count: Record<string, number>;

  constructor(storage: GoogleStorage) {
    this.storage = storage;
    this.count = {};
    this.updateCount();
  }

  async get(type: string, num: number) {
    console.log(`Getting track "${type}${num}"...`);
    const path = `soundTracks/${type}Tracks/${type}${num}.mp3`;
    const stream = await this.storage.get(path);
    if (stream instanceof Error) {
      console.error(stream.message);
    }
    return stream;
  }

  // Uploads a stream to storage bucket in the trackType subfolder in soundtracks
  async add(
    type: string,
    stream: NodeJS.ReadableStream,
  ): Promise<File | Error> {
    const number = this.count[type] || 0;
    console.log(`Registering track ${type}${number}...`);
    const filename = `soundTracks/${type}Tracks/${type}${number}.mp3`;

    const file = await this.add(filename, stream);
    if (file instanceof Error) return file;

    this.count[type]++;
    console.log(`Registered ${type}${number} succesfully.`);

    return file;
  }

  // Looks at all the files in the soundTracks bucket,
  // and updates the count property based on the files there.
  async updateCount(): Promise<Record<string, number>> {
    const allFiles = await this.storage.getAll("soundTracks/");
    const tempCount: Record<string, number> = {};
    allFiles.forEach((file) => {
      const trackType = new RegExp("(?<=/).*(?=Tracks/)").exec(file.name);
      if (!Array.isArray(trackType)) return;
      tempCount[trackType[0]]
        ? (tempCount[trackType[0]]++)
        : (tempCount[trackType[0]] = 1);
    });
    this.count = tempCount;
    return this.count;
  }
}
