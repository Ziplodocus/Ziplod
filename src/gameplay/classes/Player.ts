import { EventEmitter } from "../helpers.js";
import { Attribute, PlayerData, EffectKey, LingeringEffect, LingeringEffectType, LingeringEffectKey } from "@ziplodocus/zumbor-types";
import { Error404 } from "../../classes/Errors.js";

type PlayerEffectType = {
  [key in EffectKey]: (...args: any) => any;
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
  get effects() {
    return this._data.effects;
  }

  getEffects(effectName: LingeringEffectKey) {
    return this.effects[effectName];
  }

  hasEffects(effectName: LingeringEffectKey) {
    return this.getEffects(effectName).length !== 0;
  };

  addEffect(effect: LingeringEffect, suppressEvents = false) {
    // @ts-ignore There is actually an overlap in these types
    if (Object.values(Attribute).includes(effect.name)) {
      console.log('Adding effect ' + effect.name);
      // @ts-ignore Actually typescript, this is the case.
      const stat = effect.name as Attribute;
      if (effect.type === LingeringEffectType.BUFF) {
        this.stats[stat] += effect.potency;
      } else if (effect.type === LingeringEffectType.DEBUFF) {
        this.stats[stat] -= effect.potency;
      }
    }

    this.getEffects(effect.name).push(effect);
    if (!suppressEvents) this.trigger(`effect_started`, { player: this, effect });
  }
  removeEffect(effect: LingeringEffect, suppressEvents = false) {

    //@ts-ignore There is actually an overlap in these types
    if (Object.values(Attribute).includes(effect.name)) {
      console.log('Removing effect ' + effect.name);
      //@ts-ignore Actually typescript, this is the case.
      const stat = effect.name as Attribute;
      if (effect.type === LingeringEffectType.BUFF) {
        this.stats[stat] -= effect.potency;
      } else if (effect.type === LingeringEffectType.DEBUFF) {
        this.stats[stat] += effect.potency;
      }
    }

    const effects = this.getEffects(effect.name);
    effects.splice( effects.indexOf(effect), 1 );
    if (!suppressEvents) this.trigger(`effect_ended`, { player: this, effect });
  }

  removeEffects(effectName: LingeringEffectKey, suppressEvents = false) {
    this.getEffects(effectName).forEach(effect => this.removeEffect(effect, suppressEvents));
  }

  removeAllEffects(suppressEvents = false) {
    Object.values(this.effects).forEach(effectList => {
      effectList.forEach(effect => {
        if (effect.duration === 0) this.removeEffect(effect, suppressEvents);
      });
    });
  }

  addScore(n = 1) {
    this._data.score += n;
  }


  iterateEffects() {
    // Run relevant effect related functions
    Object.values(this.effects).forEach(effectList => {
      effectList.forEach(effect => {

        if (effect.name === LingeringEffectKey.POISON) {
          this[EffectKey.DAMAGE](effect.potency);
          this.trigger(`${LingeringEffectKey.POISON}_apply`, { player: this, effect });
        }

        if (effect.name === LingeringEffectKey.REGENERATE) {
          this[EffectKey.HEAL](effect.potency);
          this.trigger(`${LingeringEffectKey.REGENERATE}_apply`, { player: this, effect });
        }

        effect.duration--;
        if (effect.duration === 0) this.removeEffect(effect);
      });
    });
  }

  "Damage" = (amount = 1) => this._data.health -= amount;
  "Heal" = (amount = 1) => {
    if (this.hasEffects(LingeringEffectKey.POISON)) {
      this.removeEffects(LingeringEffectKey.POISON);
      this.trigger('poison_healed', this);
    }
    this._data.health += amount;
  };
  "Charisma" = (n = 1) => this._data.stats[Attribute.CHARISMA] += n;
  "Strength" = (n = 1) => this._data.stats[Attribute.STRENGTH] += n;
  "Wisdom" = (n = 1) => this._data.stats[Attribute.WISDOM] += n;
  "Agility" = (n = 1) => this._data.stats[Attribute.AGILITY] += n;
}
