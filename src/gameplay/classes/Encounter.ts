import { streamToString } from "../../utility/other.js";
import { Files } from "../../ziplod.js";
import { EventEmitter } from "../helpers.js";
import {
  Attribute,
  EncounterData,
  EncounterResult,
  PlayerEffect,
} from "../types/index.js";

export class Encounter extends EventEmitter {
  data: EncounterData;
  constructor(encounter: EncounterData) {
    super();
    this.data = encounter;
  }
  static async random(): Promise<EncounterData> {
    return {
      title: "A Goblin Appears!",
      text: "This nasty boy looks tough, but can you take them?",
      color: "#111",
      options: {
        "Fight": {
          threshold: 8,
          stat: Attribute.Strength,
          [EncounterResult.SUCCESS]: {
            type: EncounterResult.SUCCESS,
            title: "Goblin pancakes for dinner!",
            text:
              "You made short work of that goblin. You can wear it's ears as a prank",
            effect: PlayerEffect.CHARISMA,
            value: 1,
          },
          [EncounterResult.FAIL]: {
            type: EncounterResult.FAIL,
            title: "Oof",
            text: "That Gobbo was tougher than he looked...",
            effect: PlayerEffect.DAMAGE,
            value: 3,
          },
        },
        "Run": {
          threshold: 5,
          stat: Attribute.Agility,
          [EncounterResult.SUCCESS]: {
            type: EncounterResult.SUCCESS,
            title: "You escaped!",
            text: "Guess you didn't fancy your chances.",
            effect: PlayerEffect.HEAL,
            value: 1,
          },
          [EncounterResult.FAIL]: {
            type: EncounterResult.FAIL,
            title: "Agh!",
            text:
              "Gobbo stabbed you in the back, yikes, and he's gotten away with it too!",
            effect: PlayerEffect.DAMAGE,
            value: 5,
          },
        },
      },
    };
  }

  // const res = await Files.get("zumbor/encounters/pow.json");
  // if (res instanceof Error) {
  //   return res;
  // }
  // return new Encounter(JSON.parse(await streamToString(res)));
}
// getResultHandler = (type: EncounterResult) => {
//   return (option: EncounterOption) =>
//     player[option[type].effect](option[type].value);
// };
