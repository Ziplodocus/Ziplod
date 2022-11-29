import { EventEmitter, rollD } from "../helpers.js";
import { Attribute, PlayerData, PlayerEffect } from "@ziplodocus/zumbor-types";
import { NewPlayerStatsModal } from "./Modals/NewPlayerStatsModal.js";

type PlayerEffectType = {
  [key in PlayerEffect]: (...a: any[]) => any;
};

export class Player extends EventEmitter
  implements PlayerEffectType, PlayerData {
  private _data: PlayerData;
  constructor(data: PlayerData) {
    super();
    this._data = data;
  }
  get user() {
    return this._data.user;
  }
  get data() {
    return this._data;
  }
  get description() {
    return this._data.description;
  }
  get name() {
    return this._data.name;
  }
  get health() {
    return this._data.health;
  }
  get score() {
    return this._data.score;
  }
  get stats() {
    return this._data.stats;
  }

  roll(attr: Attribute) {
    return rollD(20, this.stats[attr]);
  }
  incrementScore() {
    this._data.score++;
  }

  "Damage" = (n = 1) => this._data.health -= n;
  "Heal" = (n = 1) => this._data.health += n;
  "No effect" = (_: any) => {};
  "Charisma" = (n = 1) => this._data.stats[Attribute.CHARISMA] += n;
  "Strength" = (n = 1) => this._data.stats[Attribute.STRENGTH] += n;
  "Wisdom" = (n = 1) => this._data.stats[Attribute.WISDOM] += n;
  "Agility" = (n = 1) => this._data.stats[Attribute.AGILITY] += n;
}
