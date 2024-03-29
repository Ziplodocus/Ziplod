import { streamToString, stringToStream } from "../../utility/other.js";
import { Files } from "../../ziplod.js";
import { PlayerData, validatePlayerData } from "@ziplodocus/zumbor-types";
import { Error404 } from "../../classes/Errors.js";

export class SaveManager {
  path: string;
  constructor(usertag: string) {
    this.path = `zumbor/saves/${usertag}.json`;
  }

  async get() {
    return await Files.get(this.path);
  }

  async add(data: PlayerData) {
    const str = JSON.stringify(data);
    return Files.add(this.path, stringToStream(str));
  }

  async update(data: PlayerData, createNew = false) {
    const str = JSON.stringify(data);
    return Files.update(
      this.path,
      stringToStream(str),
      createNew,
    );
  }

  async remove() {
    try {
      return Files.remove(this.path);
    } catch (e : any) {
      console.error(e);
      if (e?.code === 404) {
        return new Error404('Save file doesn\'t exist to delete!');
      }
      return new Error('Other Error');
    }
  }

  async save(data: PlayerData): Promise<true | Error> {
    return await this.update(data, true);
  }
  async load(): Promise<PlayerData | Error> {
    const res = await this.get();
    if (res instanceof Error) return res;

    const textData = await streamToString(res);
    const potentialPlayerData = JSON.parse(textData);
    console.dir(potentialPlayerData);
    const validatedData = validatePlayerData(potentialPlayerData);
    return validatedData;
  }
}
