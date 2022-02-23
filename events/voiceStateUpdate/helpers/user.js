
import { playTheme } from '../../../helperFunctions/helpers.js';

// Handles voice state updates for non-bot users
export function handleUser( oldState, newState ) {
    console.log(`Voice state of ${newState.member.user.tag} changed`);
    if (oldState.channel == undefined && newState.channel !== undefined) {
        playTheme(newState, "int")
    }
    else if (newState.channel == undefined && oldState.channel !== undefined) {
        playTheme(oldState, "out")
    }
}