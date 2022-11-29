import { streamToString, stringToStream } from "../../utility/other.js";
import { Files } from "../../ziplod.js";
import { PlayerData } from "@ziplodocus/zumbor-types";

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
    return Files.remove(this.path);
  }

  async save(data: PlayerData): Promise<true | Error> {
    return await this.update(data, true);
  }
  async load(): Promise<PlayerData | Error> {
    const res = await this.get();
    if (res instanceof Error) return res;

    const textData = await streamToString(res);
    return JSON.parse(textData);
  }
}
