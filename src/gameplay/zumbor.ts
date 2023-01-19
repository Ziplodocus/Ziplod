import { Player } from "./classes/Player.js";
import { SaveManager } from "./classes/SaveManager.js";

import ExtendedMessage from "../classes/ExtendedMessage.js";
import { EncounterResult, LingeringEffectKey, PlayerData } from "@ziplodocus/zumbor-types";
import { UserInterface } from "./classes/UserInterface.js";
import { ButtonInteraction, CommandInteractionOptionResolver } from "discord.js";
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
  player.on('effect_start', ({ player, effect }) => {
    console.log('effect started', effect.name);
    ui.queueMessage(`${player.name} has received a ${effect.name} ${effect.type}`);
  });
  player.on('effect_end', ({ player, effect }) => {
    ui.queueMessage(`${effect.name} ${effect.type} has been removed from ${player.name}`);
  });
  player.on(`${LingeringEffectKey.POISON}_healed`, () => {
    ui.queueMessage(`${player.name}'s poison has been healed!`);
  });
  player.on(`${LingeringEffectKey.POISON}_apply`, ({ player, effect }) => {
    ui.queueMessage(`${player.name} loses ${effect.potency} health to poison`);
  });
  player.on(`${LingeringEffectKey.REGENERATE}_apply`, ({ player, effect }) => {
    ui.queueMessage(`${player.name} regenerates ${effect.potency} health`);
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
    console.dir(encounter.options);
    // Show user encounter text and give options, wait for user input
    interaction = await ui.startEncounter(encounter);

    let option = encounter.options[interaction.customId];

    const rollResult = rollCheck(option.threshold, player.stats[option.stat]);

    const result = option[EncounterResult[rollResult.success ? "SUCCESS" : "FAIL"]];

    if (result.baseEffect) {
      if (rollResult.critical) result.baseEffect.potency *= 2;

      player[result.baseEffect.name](result.baseEffect.potency);
    }

    if (result.additionalEffect) {
      player.addEffect(result.additionalEffect);
    }

    player.iterateEffects();
    player.addScore(1);

    await ui.endEncounter(result, player, interaction);

    if (player.health <= 0) {
      player.removeAllEffects(true);
      ui.death();

      // Scoreboard handling
      const didWin = await scoreboard.set(player.data);
      if (didWin instanceof Error) return console.warn(didWin);
      if (didWin) ui.niceMessage('Winner!', 'You\'ve made the board');
      else ui.niceMessage('Lose!', 'I knew you wouldn\'t make it');

      // Save file handling
      runningGames.delete(msg.message.author.id);
      try {
        saveFile.remove();
      } catch (e) {
        console.log('Caught save file remove error: ', e);
      }
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
