import {playTheme, randomTime, playRandomMeme} from '../functions/helpers.js';

export const voiceStateUpdate = {
    name: 'voiceStateUpdate',
    how: 'on',
    execute(oldState, newState) {
        if ( newState.member.user.bot ) return intervalMeme(oldState, newState);
        console.log(`Voice state of ${newState.member.user.tag} changed`);
        if (oldState.channel == undefined && newState.channel !== undefined) {
            playTheme(newState, "int")
        }
        else if (newState.channel == undefined && oldState.channel !== undefined) {
            playTheme(oldState, "out")
        }
    }
};

function intervalMeme( oldState, newState ) {
    const newId = newState.guild.id;
    const oldId = oldState.guild.id;

    if( newState.channel === undefined ) {
        clearTimeout( intervalMeme[oldId].memeTimeout );
        intervalMeme[oldId] = false;
        return
    }

    intervalMeme[newId] = {
        currChannel: newState.channel,
        memeTimeout: setTimeout( () => {
            playRandomMeme( intervalMeme[newId].currChannel );
            intervalMeme( oldState, newState );
        }, randomTime() )
    }

    console.dir( intervalMeme );
    if( newId !== oldId ) clearTimeout( intervalMeme[oldId].memeTimeout );
}