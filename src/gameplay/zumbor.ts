import { Player } from "./classes/Player.js";
import { SaveManager } from "./classes/SaveManager.js";

import ExtendedMessage from "../classes/ExtendedMessage.js";
import { EncounterResult, PlayerData, Effect, EffectOptions } from "@ziplodocus/zumbor-types";
import { UserInterface } from "./classes/UserInterface.js";
import { ButtonInteraction } from "discord.js";
import { EncounterManager } from "./classes/EncounterManager.js";
import { Files } from "../ziplod.js";
import { ScoreBoard } from "./classes/ScoreBoard.js";
import { rollCheck } from "./helpers.js";


export const encounters = new EncounterManager(Files);
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
  if (playerData instanceof Error) {
    runningGames.delete(msg.message.author.id);
    return;
  }

  const player = new Player(playerData);

  // Player events
  player.on('poison_healed', () => {
    ui.queueMessage(`${player.name}'s poison has been healed!`);
  });

  // Game loop
  while (true) {
    // Allows interaction to be mutated and referenced from this scope
    let interaction: ButtonInteraction | undefined;

    const encounter = await encounters.get();
    if (encounter instanceof Error) {
      console.error(encounter);
      break;
    }
    // Show user encounter text and give options, wait for user input
    interaction = await ui.startEncounter(encounter);

    let option = encounter.options[interaction.customId];

    const rollResult = rollCheck(option.threshold, player.stats[option.stat]);

    const result = option[EncounterResult[rollResult.success ? "SUCCESS" : "FAIL"]];

    if (rollResult.critical) result.potency *= 2;

    player[result.baseEffect.name](result.baseEffect.potency);
    player.iterateEffects();
    player.incrementScore();

    await ui.endEncounter(result, player, interaction);

    if (player.health <= 0) {
      ui.death();

      // Scoreboard handling
      const didWin = await scoreboard.set(player.data);
      if (didWin instanceof Error) return console.warn(didWin);
      if (didWin) ui.niceMessage('Winner!', 'You\'ve made the board');
      else ui.niceMessage('Lose!', 'I knew you wouldn\'t make it');

      // Save file handling
      runningGames.delete(msg.message.author.id);
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
