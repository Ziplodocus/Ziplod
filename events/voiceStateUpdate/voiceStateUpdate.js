import { handleBot } from "./helpers/bot.js";
import { handleUser } from "./helpers/user.js";
import { EventWhen } from '../events.js';
export const type = EventWhen.on;
export function voiceStateUpdate(oldState, newState) {
    if (newState?.member?.user?.bot)
        return handleBot(oldState, newState);
    else
        return handleUser(oldState, newState);
}
