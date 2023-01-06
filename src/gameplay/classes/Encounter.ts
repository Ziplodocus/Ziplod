import {
  Attribute,
  EncounterData,
  EncounterResult,
  EffectKey,
} from "@ziplodocus/zumbor-types";


export async function random(): Promise<EncounterData> {
  return {
    title: "A Goblin Appears!",
    text: "This nasty boy looks tough, but can you take them?",
    color: "#111",
    options: {
      "Fight": {
        threshold: 8,
        stat: Attribute.STRENGTH,
        "Success": {
          type: EncounterResult.SUCCESS,
          title: "Goblin pancakes for dinner!",
          text:
            "You made short work of that goblin. You can wear it's ears as a prank",
          baseEffect: {
            name: EffectKey.CHARISMA,
            potency: 1,
          },
        },
        "Fail": {
          type: EncounterResult.FAIL,
          title: "Oof",
          text: "That Gobbo was tougher than he looked...",
          baseEffect: {
            name: EffectKey.DAMAGE,
            potency: 3,
          },
        },
      },
      "Run": {
        threshold: 5,
        stat: Attribute.AGILITY,
        "Success": {
          type: EncounterResult.SUCCESS,
          title: "You escaped!",
          text: "Guess you didn't fancy your chances.",
          baseEffect: {
            name: EffectKey.HEAL,
            potency: 1,
          },
        },
        "Fail": {
          type: EncounterResult.FAIL,
          title: "Agh!",
          text: "Gobbo stabbed you in the back, yikes, and he's gotten away with it too!",
          baseEffect: {
            name: EffectKey.DAMAGE,
            potency: 5,
          },
        },
      },
    },
  };
}
