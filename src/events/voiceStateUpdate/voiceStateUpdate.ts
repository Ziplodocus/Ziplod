import { playTheme } from "../../utility/sounds.js";
import { EventWhen } from "../events.js";
import { Client, VoiceState } from "discord.js";
import { IntervalMeme } from "../../classes/IntervalMeme.js";

export const type: keyof Client = EventWhen.on;
export function voiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
  return newState?.member?.user?.bot
    ? handleBot(oldState, newState)
    : handleUser(oldState, newState);
}

// Handles voice state updates for non-bot users
function handleUser(oldState: VoiceState, newState: VoiceState) {
  console.log(`Voice state of ${newState.member?.user.tag} changed`);
  if (oldState.channel == undefined && newState.channel !== undefined) {
    playTheme(newState, "intro");
  } else if (newState.channel == undefined && oldState.channel !== undefined) {
    playTheme(oldState, "outro");
  }
}

function handleBot(oldState: VoiceState, newState: VoiceState) {
  const newChan = newState.channel;
  const oldChan = oldState.channel;
  if (oldChan === newChan) return;

  const isNewChanVoice = (newChan && newChan.type === "GUILD_VOICE");
  const isOldChanVoice = (oldChan && oldChan.type === "GUILD_VOICE");

  if (isOldChanVoice) IntervalMeme[oldState.guild.id]?.destroy();
  if (isNewChanVoice) new IntervalMeme(newChan);
}
