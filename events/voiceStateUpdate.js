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

    if( newState.channel === undefined ) {
        clearTimeout(intervalMeme[oldState.guild.id].memeTimeout)
        intervalMeme[oldState.guild.id] = false;
        return
    }

    //if( intervalMeme[newState.guild.id] && ( newState.channel !== intervalMeme[newState.guild.id].currChannel ) ) 
    console.log(intervalMeme);
    intervalMeme[newState.guild.id] = {
        currChannel: newState.channel,
        memeTimeout: setTimeout( () => {
            playRandomMeme(intervalMeme[newState.guild.id].currChannel);
            intervalMeme(oldState, newState);
        }, randomTime() )
    }
    if(intervalMeme[oldState.guild.id]) clearTimeout(intervalMeme[oldState.guild.id].memeTimeout);

}