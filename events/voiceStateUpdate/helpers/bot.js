import { randomTime, playRandomMeme } from '../../../helperFunctions/helpers.js';

export function handleBot( oldState, newState ) {
    //Guild id will be same for both states, voicestateupdate cannot be across guilds ( for ziplod )
    const guildId = newState.guild.id;
    const newChan = newState.channel;
    const oldChan = oldState.channel;
    const isNewChannel = ( oldChan !== newChan );
    if ( !intervalMeme[guildId] ) return intervalMeme[guildId] = new intervalMeme( newChan );
    const interval = intervalMeme[guildId];

    switch ( true ) {
        case newChan === undefined:
            interval.destroy();
            break;
        case oldChan && isNewChannel:
            interval.changeChannel( newChan );
            break;
    }
}

class intervalMeme {
    constructor( channel ) {
        this.channel = channel

        this.destroy = () => {
            console.log('destroyed');
            clearTimeout(this.timeOut);
            delete intervalMeme[channel.guild.id];
        }

        this.refresh = () => {
            this.timeOut = setTimeout( async () => {
                playRandomMeme(this.channel)
                this.refresh();
            }, randomTime() )
        }

        this.changeChannel = newChannel => {
            this.destroy();
            this.channel = newChannel;
            this.refresh()
        }

        this.refresh();
    }
}