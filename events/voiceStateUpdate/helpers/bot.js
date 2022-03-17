import { randomTime, playRandomMeme } from '../../../helperFunctions/helpers.js';
export function handleBot(oldState, newState) {
    const newChan = newState.channel;
    const oldChan = oldState.channel;
    if (oldChan === newChan)
        return;
    const guildId = newState.guild.id;
    let interval = IntervalMeme[guildId];
    const isJoiningNewChannel = !!newChan && (newChan !== oldChan);
    const isLeavingChannel = !newChan && !!oldChan;
    const isChangingChannel = (newChan && oldChan) && (oldChan === newChan);
    const isNewChanVoice = (newChan?.type === "GUILD_VOICE");
    const isOldChanVoice = (oldChan?.type === "GUILD_VOICE");
    // console.log(!newChan, !!oldChan, isLeavingChannel);
    if (isJoiningNewChannel && (newChan.type === "GUILD_VOICE"))
        new IntervalMeme(newChan);
    else if (isLeavingChannel && (oldChan.type === "GUILD_VOICE"))
        interval.destroy();
    else if (isChangingChannel) {
        if (!isNewChanVoice && !isOldChanVoice)
            return;
        else if (isNewChanVoice && isOldChanVoice)
            interval.changeChannel(newChan);
        else if (isNewChanVoice && !isOldChanVoice)
            new IntervalMeme(newChan);
        else if (!isNewChanVoice && isOldChanVoice)
            interval.destroy();
    }
}
class IntervalMeme {
    channel;
    destroy;
    refresh;
    changeChannel;
    timeOut;
    constructor(channel) {
        IntervalMeme[channel.guild.id] = this;
        this.channel = channel;
        this.destroy = () => {
            console.log('destroyed' + channel.guild.id);
            global.clearTimeout(this.timeOut);
            delete IntervalMeme[channel.guild.id];
        };
        this.refresh = () => {
            this.timeOut = setTimeout(async () => {
                playRandomMeme(this.channel);
                this.refresh();
            }, randomTime());
        };
        this.changeChannel = (newChannel) => {
            this.destroy();
            this.channel = newChannel;
            this.refresh();
        };
        this.timeOut = setTimeout(async () => {
            playRandomMeme(this.channel);
            this.refresh();
        }, randomTime());
    }
}
