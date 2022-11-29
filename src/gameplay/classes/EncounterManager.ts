import { FileManager } from "../../classes/FileManager.js";
import { EncounterData } from "../types/EncounterData.js";

export class EncounterManager {
  storage: FileManager;
  cache: Array<EncounterData>;

  constructor(storage: FileManager) {
    this.storage = storage;
    this.cache = [];
  }

  async get() : Promise<EncounterData | Error> {
    if (this.cache.length === 0) this.updateCache();
    const rand = Math.floor(this.cache.length * Math.random());
    return this.cache[rand];
  }

  // Looks at all the user's themes in the bucket,
  // and updates the cache property based on the files there.
  async updateCache() {
    this.cache = [];
    // Fetch details on all user themes
    const allFiles = await this.storage.getAll(`zumbor/encounters`);

    // Increment cacheer for each theme of that type
    allFiles.forEach((file) => {
        const res = file.download();
        const resolved = res.toString();
        const encounter : EncounterData = JSON.parse(resolved);
        this.cache.push(encounter);
    });
  }
}
