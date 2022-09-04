import { Player } from "./classes/Player.js";
import { SaveManager } from "./classes/SaveManager.js";

import { Encounter } from "./classes/Encounter.js";
import ExtendedMessage from "../classes/ExtendedMessage.js";
import { EncounterResult } from "./types/index.js";
import { UserInterface } from "./classes/UserInterface.js";
import { ButtonInteraction } from "discord.js";

export async function zumborInit(msg: ExtendedMessage) {
  const saveManager = new SaveManager(msg.message.author.tag);
  const ui = new UserInterface(msg);
  let playerData = await saveManager.load();
  if (playerData instanceof Error) {
    // get user input for creation of new character : ui.newPlayer()
    playerData = await ui.newPlayer();
  }
  ui.sendPlayerInfo(playerData);
  const player = new Player(playerData);
  let interaction: ButtonInteraction | undefined;

  while (true) {
    const encounter = await Encounter.random();
    // Show user encounter text and give options, wait for user input
    interaction = await ui.startEncounter(encounter);
    console.log("This is the option: " + interaction.customId);

    // Roll for the encounter option selected and trigger success/fail on encounter
    let option = encounter.options[interaction.customId];
    console.log("Selected option:", option);

    // Determine outcome
    const roll = player.roll(option.stat);
    console.log(`You rolled ${roll}`);
    console.log(`You needed ${option.threshold}`);
    const isSuccess = roll > option.threshold;

    const result = option[EncounterResult[isSuccess ? "SUCCESS" : "FAIL"]];
    console.log(result);

    // Handles the results of the encounter
    player[result.effect](result.value);
    player.incrementScore();
    interaction = await ui.endEncounter(result, player, interaction);

    if (interaction?.customId === "continue") continue;
    let saveResult = await saveManager.save(player.data);
    console.log(saveResult);
    break;
  }
}
