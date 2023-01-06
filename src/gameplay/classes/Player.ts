import { EventEmitter } from "../helpers.js";
import { Attribute, PlayerData, Effect, EffectOptions, LingeringEffectKey } from "@ziplodocus/zumbor-types";
import { Error404 } from "../../classes/Errors.js";

type PlayerEffectType = {
  [key in Effect]: (...a: any[]) => any;
};

export class Player extends EventEmitter
  implements PlayerEffectType, PlayerData {
  private _data: PlayerData;
  constructor(data: PlayerData) {
    super();
    this._data = data;

    // Prefill data with effects if not already there
    for (let effect in EffectKey) {
      if (!this.data.effects.has(EffectKey[effect as keyof Effect])) this.data.effects.set(EffectKey[effect], []);
    }
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
  getEffects(effectName: LingeringEffectKey): EffectOptions[] {
    return this.effects.get(effectName) as Set<LingeringEffect>;
  }
  hasEffects(effectName: LingeringEffectKey) {
    return this.getEffects(effectName).size !== 0;
  };
  addEffect(effect: LingeringEffect) {
    this.getEffects(effect.name).set(effect);
  }
  removeEffect(effect: LingeringEffect) {
    this.getEffects(effect.name).delete(effect);
  }

  addScore(n = 1) {
    this._data.score += n;
  }

  iterateEffects() {
    // Run relevant effect related functions
    player.effects.forEach((effectList, effectName) => {
      effectList.forEach(effect => {
        switch (effectName) {
          case LingeringEffectKey.AGILITY:
          case LingeringEffectKey.CHARISMA:
          case LingeringEffectKey.STRENGTH:
          case LingeringEffectKey.WISDOM:
            break;
          case LingeringEffectKey.POISON:
            const { potency, duration } = effect;
            player[Effect.DAMAGE](poisonDamage);
            ui.queueMessage(`${player.name} takes ${poisonDamage} poison damage`);
            poisonedEffect.duration -= 1;
            if (poisonedEffect.duration === 0) ui.queueMessage(`You feel better now`);
        }
        effect.duration--;
        if (effect.duration <= 0) this.removeEffect(effect);
      });


    });

    if (player.effects.has(Effect.POISON)) {

    }
  }

  "Damage" = (amount = 1) => this._data.health -= amount;
  "Heal" = (amount = 1) => {
    if (this.hasEffect(Effect.POISON)) {
      this.effects.set(Effect.POISON, []);
      this.trigger('poison_healed', null);
    }
    this._data.health += amount;
  };
  "No effect" = (_: any) => {};
  "Charisma" = (n = 1) => this._data.stats[Attribute.CHARISMA] += n;
  "Strength" = (n = 1) => this._data.stats[Attribute.STRENGTH] += n;
  "Wisdom" = (n = 1) => this._data.stats[Attribute.WISDOM] += n;
  "Agility" = (n = 1) => this._data.stats[Attribute.AGILITY] += n;
}
