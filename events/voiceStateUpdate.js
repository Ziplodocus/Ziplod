
import { handleBot } from './voiceStateUpdate/bot.js';
import { handleUser } from './voiceStateUpdate/user.js';

export const voiceStateUpdate = {
    name: 'voiceStateUpdate',
    how: 'on',
    execute( oldState, newState ) {
        if ( newState.member.user.bot ) return handleBot( oldState, newState );
        else return handleUser( oldState, newState );        
    }
};

