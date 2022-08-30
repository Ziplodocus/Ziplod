import { AssetManager, FileManager } from "../../classes/FileManager";
import { Encounter } from "./Encounter";
import { Player } from "./Player";

type SaveData = {
  player: Player;
  encounter: Encounter;
};

// export class SaveManager implements AssetManager {
//   storage: FileManager;
//   constructor(storage: FileManager) {
//     this.storage = storage;
//   }
//   get(usertag: string) {
//   }
//   add(usertag: string, data: SaveData) {
//   }
//   update(usertag: string, data: SaveData) {
//   }
//   remove(usertag: string) {
//   }
// }
