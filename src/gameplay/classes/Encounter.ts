import {
  Attribute,
  EncounterData,
  EncounterResult,
  PlayerEffect,
} from "../types/index.js";


export async function random(): Promise<EncounterData> {
  return {
    title: "A Goblin Appears!",
    text: "This nasty boy looks tough, but can you take them?",
    color: "#111",
    options: {
      "Fight": {
        threshold: 8,
        stat: Attribute.Strength,
        success: {
          type: EncounterResult.SUCCESS,
          title: "Goblin pancakes for dinner!",
          text:
            "You made short work of that goblin. You can wear it's ears as a prank",
          effect: PlayerEffect.CHARISMA,
          value: 1,
        },
        fail: {
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
        success: {
          type: EncounterResult.SUCCESS,
          title: "You escaped!",
          text: "Guess you didn't fancy your chances.",
          effect: PlayerEffect.HEAL,
          value: 1,
        },
        fail: {
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
