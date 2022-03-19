import { handleBot } from "./helpers/bot.js";
import { handleUser } from "./helpers/user.js";
import { EventWhen } from '../events.js';
import { Client, VoiceState } from "discord.js";

export const type: keyof Client = EventWhen.on;
export function voiceStateUpdate( oldState: VoiceState, newState: VoiceState ) {
	if ( newState?.member?.user?.bot ) return handleBot( oldState, newState );
	else return handleUser( oldState, newState );
}
