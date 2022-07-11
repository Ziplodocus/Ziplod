import { VoiceBasedChannel, VoiceChannel } from 'discord.js';
import { randomTime } from '../utility/other.js';
import { playRandomMeme } from '../utility/sounds.js';

export class IntervalMeme {
    channel: VoiceChannel;
    timeOut!: NodeJS.Timeout;
    static [index: string]: IntervalMeme;

    constructor( channel: VoiceChannel ) {
        IntervalMeme[channel.guild.id] = this;
        this.channel = channel;
        this.refresh();
        console.log('Set interval meme ' + this.channel.guild.id + ' in channel: ' + this.channel.name);
    }

    destroy () {
        console.log(this.channel, this.timeOut);
        console.log( 'destroyed timeout ' + this.channel.guild.id + ' in channel: ' + this.channel.name);
        global.clearTimeout( this.timeOut );
        delete IntervalMeme[this.channel.guild.id];
    };

    refresh () {
        this.timeOut = setTimeout( async () => {
            playRandomMeme( this.channel );
            this.refresh();
        }, randomTime() );
    };

    changeChannel ( newChannel: VoiceBasedChannel ) {
        console.log(this.channel, newChannel);
        if (newChannel.type !== "GUILD_VOICE") {
            this.destroy();
        } else {
            this.destroy();
            this.channel = newChannel;
            this.refresh();
        }
    };
}