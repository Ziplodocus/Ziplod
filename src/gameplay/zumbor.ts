import { Player } from "./classes/Player.js";
import { SaveManager } from "./classes/SaveManager.js";

import { Encounter } from "./classes/Encounter.js";
import ExtendedMessage from "../classes/ExtendedMessage.js";
import { EncounterResult, PlayerData } from "./types/index.js";
import { UserInterface } from "./classes/UserInterface.js";
import { ButtonInteraction } from "discord.js";

// Tracks running game instances to prevent one player creating multiple instances
const runningGames : Set<string> = new Set();

export async function zumborInit(msg: ExtendedMessage) {
  if (runningGames.has(msg.message.author.id)) return msg.message.reply('You already have a Zumbor instance running dumbo.');
  runningGames.add(msg.message.author.id);
  // Define our helper classes
  const saveManager = new SaveManager(msg.message.author.tag);
  const ui = new UserInterface(msg);

  // Load existing player data, or create a new player
  let playerData : Error | PlayerData = new Error('bonk'); //await saveManager.load();
  if (playerData instanceof Error) playerData = await ui.newPlayer();
  else ui.sendPlayerInfo(playerData);
  const player = new Player(playerData);

  let interaction: ButtonInteraction | undefined;

  // Game loop
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
    await ui.endEncounter(result, player, interaction);

    if (player.health <= 0) {
      ui.death();
      // ScoreBoard.set(player);
      break;
    }

    interaction = await ui.nextEncounter();

    if (interaction?.customId === "continue") continue;

    ui.niceMessage(`${player.name} retires for now...`, '');
    let saveResult = await saveManager.save(player.data);

    runningGames.delete(msg.message.author.id);

    console.log(saveResult);
    break;
  }
}
