import { randomTime, playRandomMeme } from '../../../helperFunctions/helpers.js';
export function handleBot(oldState, newState) {
    const newChan = newState.channel;
    const oldChan = oldState.channel;
    if (oldChan === newChan)
        return;
    const guildId = newState.guild.id;
    const interval = intervalMeme[guildId];
    const isJoiningNewChannel = !!newChan && (newChan !== oldChan);
    const isLeavingChannel = !newChan && !!oldChan;
    const isChangingChannel = (newChan && oldChan) && (oldChan === newChan);
    const isNewChanVoice = (newChan === null || newChan === void 0 ? void 0 : newChan.type) === "GUILD_VOICE";
    const isOldChanVoice = (oldChan === null || oldChan === void 0 ? void 0 : oldChan.type) === "GUILD_VOICE";
    if (isJoiningNewChannel && newChan.type === "GUILD_VOICE")
        new intervalMeme(newChan);
    else if (isLeavingChannel && oldChan.type === "GUILD_VOICE")
        interval.destroy();
    else if (isChangingChannel) {
        if (!isNewChanVoice && !isOldChanVoice)
            return;
        else if (isNewChanVoice && isOldChanVoice)
            interval.changeChannel(newChan);
        else if (isNewChanVoice && !isOldChanVoice)
            new intervalMeme(newChan);
        else if (!isNewChanVoice && isOldChanVoice)
            interval.destroy();
    }
}
class intervalMeme {
    constructor(channel) {
        intervalMeme[channel.guild.id] = this;
        this.channel = channel;
        this.destroy = () => {
            console.log('destroyed');
            global.clearTimeout(this.timeOut);
            delete intervalMeme[channel.guild.id];
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
