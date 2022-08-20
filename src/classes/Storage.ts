import { Bucket, Storage } from "@google-cloud/storage";
import { File } from "@google-cloud/storage/build/src/file.js";
import { Readable } from "stream";

// Must have a Google cloud service account key and an env variable
// named GOOGLE_APPLICATION_CREDENTIALS set as the path pointing to the json key.
export default class GoogleStorage {
  bucket: Bucket;

  themeCount: Record<string, Record<string, number>>;
  // Connect to google api and connect to named bucket
  constructor(bucketName: string) {
    const storage = new Storage();
    this.bucket = storage.bucket(bucketName);
    // Assign a track count with the purpose to avoid requesting tracks that don't exist
    this.themeCount = {};
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
}
