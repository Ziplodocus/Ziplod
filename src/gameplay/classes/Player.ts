import { EventEmitter, rollD } from "../helpers.js";
import { Attribute, PlayerData, PlayerEffect } from "../types/index.js";

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

  damage(n = 1) {
    this._data.health -= n;
  }
  heal(n = 1) {
    this._data.health += n;
  }
  roll(attr: Attribute) {
    return rollD(20, this.stats[attr]);
  }
  incrementScore() {
    this._data.score++;
  }
  "no effect" = (nada: any) => {};
  "charisma" = (n: number) => {
    this._data.stats.charisma++;
  };
}
