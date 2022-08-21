import { VoiceChannel } from "discord.js";
import { randomTime } from "../utility/other.js";
import { playRandomMeme } from "../utility/sounds.js";

export class IntervalMeme {
  channel: VoiceChannel;
  timeOut!: NodeJS.Timeout;
  static [index: string]: IntervalMeme

  constructor(channel: VoiceChannel) {
    IntervalMeme[channel.guild.id] = this;
    this.channel = channel;
    this.refresh();
  }

  destroy() {
    global.clearTimeout(this.timeOut);
    delete IntervalMeme[this.channel.guild.id];
    console.log(`Destroyed meme interval in channel "${this.channel.name}"`);
  }

  refresh() {
    this.timeOut = setTimeout(async () => {
      playRandomMeme(this.channel);
      this.refresh();
    }, randomTime());
  }
}
