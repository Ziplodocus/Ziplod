import { VoiceChannel, VoiceState } from 'discord.js';
import { playRandomMeme } from '../../../utility/sounds.js';
import { randomTime } from '../../../utility/other.js';
import {IntervalMeme} from '../../../classes/IntervalMeme.js';

export function handleBot( oldState: VoiceState, newState: VoiceState ) {
    const newChan = newState.channel;
    const oldChan = oldState.channel;
    if ( oldChan === newChan ) return;

    const guildId = newState.guild.id;
    let interval = IntervalMeme[guildId];

    const isJoiningNewChannel = !!newChan && ( newChan !== oldChan );
    const isLeavingChannel = !newChan && !!oldChan;
    const isChangingChannel = ( newChan && oldChan ) && ( oldChan === newChan );
    const isNewChanVoice = ( newChan?.type === "GUILD_VOICE" );
    const isOldChanVoice = ( oldChan?.type === "GUILD_VOICE" );
    // console.log(!newChan, !!oldChan, isLeavingChannel);

    if ( isJoiningNewChannel && ( newChan.type === "GUILD_VOICE" ) ) new IntervalMeme( newChan );
    else if ( isLeavingChannel && ( oldChan.type === "GUILD_VOICE" ) ) interval.destroy();
    else if ( isChangingChannel ) interval.changeChannel(newChan);
    // {
    //     if ( !isNewChanVoice && !isOldChanVoice ) return;
    //     else if ( isNewChanVoice && isOldChanVoice ) interval.changeChannel( newChan );
    //     else if ( isNewChanVoice && !isOldChanVoice ) new IntervalMeme( newChan );
    //     else if ( !isNewChanVoice && isOldChanVoice ) interval.destroy();
    // }
}