import { Bucket, File } from "@google-cloud/storage";
import { Readable } from "stream";
import { Error404 } from "./Errors.js";

export interface AssetManager {
  get: (path: string, ...args: any[]) => Promise<Readable | Error>;
  add: (path: string, ...args: any[]) => Promise<File | Error>;
  // update: (path: string, ...args: any[]) => Promise<true | Error>;
  remove: (path: string, ...args: any[]) => Promise<true | Error>;
}

export class FileManager implements AssetManager {
  bucket: Bucket;
  // Connect to google api and connect to named bucket
  constructor(bucket: Bucket) {
    this.bucket = bucket;
  }

  private isValid(path: string) {
    return (new RegExp("s/[^A-Za-z0-9.-]/_/").test(path))
      ? (new Error("That's an unnaceptable command name 👺"))
      : true;
  }

  async get(path: string): Promise<Readable | Error> {
    const isValid = this.isValid(path);
    if (isValid instanceof Error) {
      console.error(isValid);
      return isValid;
    }

    const file = this.bucket.file(path);

    const exists = (await file.exists())[0];
    if (!exists) {
      console.error(`${path} does not exist`);
      return new Error404(`${path} does not exist`);
    }

    console.log(`Getting ${file.name}...`);
    return file.createReadStream();
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
  ) {
    const isValid = this.isValid(path);
    if (isValid instanceof Error) {
      console.error(isValid);
      return isValid;
    }

    const file = this.bucket.file(path);

    const exists = (await file.exists())[0];
    if (exists) {
      console.error("File already exists");
      return new Error("File already exists");
    }

    console.log(`Adding ${file.name}...`);
    stream.pipe(file.createWriteStream());
    console.log(`Added ${file.name}.`);
    return file;
  }

  async update(path: string, stream: Readable, createNew = false) {
    const isValid = this.isValid(path);
    if (isValid instanceof Error) {
      console.error(isValid);
      return isValid;
    }

    const file = this.bucket.file(path);

    if (!createNew && !((await file.exists())[0])) {
      console.error("File doesn't exist to update");
      return new Error("File doesn't exist to update");
    }

    console.log(`Updating ${file.name}...`);
    stream.pipe(file.createWriteStream());
    console.log(`Updated ${file.name}.`);
    return true;
  }

  async remove(path: string) {
    const isValid = this.isValid(path);
    if (isValid instanceof Error) {
      console.error(isValid);
      return isValid;
    }

    const file = this.bucket.file(path);
    if (!(await file.exists())) return new Error404('File does not exist!');
    console.log(`Removing ${file.name}...`);
    const delResult = await file.delete();
    if (delResult instanceof Error) {
      console.error(delResult.message);
      return new Error("Something went wrong :'(");
    }
    console.log(`Removed ${file.name}`);
    return true;
  }
}
