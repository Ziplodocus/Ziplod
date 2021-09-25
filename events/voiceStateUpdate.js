import {playTheme} from '../functions/helpers.js';

export const voiceStateUpdate = {
    name: 'voiceStateUpdate',
    how: 'on',
    execute(oldState, newState) {
        if (newState.member.user.bot) return;
        console.log(`Voice state of ${newState.member.user.tag} changed`);
        if (oldState.channel == undefined && newState.channel !== undefined) {
            playTheme(newState, "int")
        }
        else if (newState.channel == undefined && oldState.channel !== undefined) {
            playTheme(oldState, "out")
        }
    }
};
