import { FileManager } from "../../classes/FileManager.js";
import { EncounterData, validateEncounterData } from "@ziplodocus/zumbor-types";

export class EncounterManager {
  storage: FileManager;
  cache: Array<EncounterData>;

  constructor(storage: FileManager) {
    this.storage = storage;
    this.cache = [];
  }

  async get(): Promise<EncounterData | Error> {
    if (this.cache.length === 0) await this.updateCache();
    const rand = Math.floor(this.cache.length * Math.random());
    const encounter = this.cache[rand];
    return encounter;
  }

  // Looks at all the user's themes in the bucket,
  // and updates the cache property based on the files there.
  async updateCache() {
    this.cache = [];
    // Fetch details on all user themes
    const allFiles = await this.storage.getAll(`zumbor/encounters`);

    // Increment cacheer for each theme of that type
    const results = allFiles.map(async (file) => {
      try {
        const res = await file.download();
        const resolved = res.toString();
        const encounter = JSON.parse(resolved);
        const validData = validateEncounterData(encounter);
        if (validData instanceof Error) {
          console.warn('JSON is invalid: ' + file.name);
          console.warn(validData);
          return;
        };
        this.cache.push(validData);
      } catch (e) {
        console.warn(e);
      }
    });
    await Promise.allSettled(results);
  }
}
