import { Player } from "./classes/Player.js";
import { SaveManager } from "./classes/SaveManager.js";

import ExtendedMessage from "../classes/ExtendedMessage.js";
import { EncounterResult, PlayerData } from "@ziplodocus/zumbor-types";
import { UserInterface } from "./classes/UserInterface.js";
import { ButtonInteraction } from "discord.js";
import { EncounterManager } from "./classes/EncounterManager.js";
import { Files } from "../ziplod.js";
import { ScoreBoard } from "./classes/ScoreBoard.js";


const encounters = new EncounterManager(Files);
export const scoreboard = new ScoreBoard();
// Tracks running game instances to prevent one player creating multiple instances
const runningGames: Set<string> = new Set();

export async function zumborInit(msg: ExtendedMessage) {
  if (runningGames.has(msg.message.author.id)) return msg.message.reply('You already have a Zumbor instance running dumbo.');
  runningGames.add(msg.message.author.id);
  // Define our helper classes
  const saveFile = new SaveManager(msg.message.author.tag);
  const ui = new UserInterface(msg);

  // Load existing player data, or create a new player
  let playerData: Error | PlayerData = await saveFile.load();
  if (playerData instanceof Error) playerData = await ui.newPlayer();
  else ui.sendPlayerInfo(playerData);
  const player = new Player(playerData);

  let interaction: ButtonInteraction | undefined;

  // Game loop
  while (true) {
    const encounter = await encounters.get();
    if (encounter instanceof Error) {
      console.error(encounter);
      break;
    }
    // Show user encounter text and give options, wait for user input
    interaction = await ui.startEncounter(encounter);

    // Roll for the encounter option selected and trigger success/fail on encounter
    let option = encounter.options[interaction.customId];

    // Determine outcome
    const roll = player.roll(option.stat);
    console.log(`You rolled ${roll}`);
    console.log(`You needed ${option.threshold}`);
    const isSuccess = roll > option.threshold;

    const result = option[EncounterResult[isSuccess ? "SUCCESS" : "FAIL"]];

    // Handles the results of the encounter
    player[result.effect](result.potency);
    player.incrementScore();
    await ui.endEncounter(result, player, interaction);

    if (player.health <= 0) {
      ui.death();
      const didWin = await scoreboard.set(player.data);
      if (didWin instanceof Error) return console.warn(didWin);
      didWin ? ui.niceMessage('Winner!', 'You\'ve made the board') : ui.niceMessage('Lose!', 'I knew you wouldn\'t make it');
      runningGames.delete(player.user)
      saveFile.remove();
      break;
    }

    interaction = await ui.nextEncounter();

    if (interaction?.customId === "continue") continue;

    ui.niceMessage(`${player.name} retires for now...`, '');
    let saveResult = await saveFile.save(player.data);
    console.log('Saved ?: ' + saveResult);
    runningGames.delete(msg.message.author.id);

    break;
  }
}
