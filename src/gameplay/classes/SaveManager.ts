import { AssetManager, FileManager } from "../../classes/FileManager";
import { Encounter } from "./Encounter";
import { Player } from "./Player";
import { streamToString, stringToStream } from "../../utility/other";

type SaveData = {
  player: Player;
  encounter: Encounter;
};

export class SaveManager implements AssetManager {
  storage: FileManager;
  base: string;
  constructor(storage: FileManager) {
    this.storage = storage;
    this.base = `zumbor/saves/`;
  }
  get(usertag: string) {
    return this.storage.get(`${this.base}${usertag}`);
  }
  async add(usertag: string, data: SaveData) {
    const str = JSON.stringify(data);
    return this.storage.add(`${this.base}${usertag}`, stringToStream(str));
  }
  async update(usertag: string, data: SaveData) {
    const str = JSON.stringify(data);
    return this.storage.update(`${this.base}${usertag}`, stringToStream(str));
  }
  async remove(usertag: string) {
    return this.storage.remove(`${this.base}${usertag}`);
  }
  async load(usertag : string) {
    const res = await this.get(usertag);
    if(res instanceof Error) return res;

    const textData = await streamToString(res);
    return JSON.parse(textData);
  }
}
