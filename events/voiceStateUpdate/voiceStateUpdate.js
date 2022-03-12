import { handleBot } from "./helpers/bot.js";
import { handleUser } from "./helpers/user.js";
import { EventWhen } from '../events.js';
export const type = EventWhen.on;
export function voiceStateUpdate(oldState, newState) {
    var _a, _b;
    if ((_b = (_a = newState === null || newState === void 0 ? void 0 : newState.member) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.bot)
        return handleBot(oldState, newState);
    else
        return handleUser(oldState, newState);
}
