import { Message, VoiceChannel } from "discord.js";
import { prefix } from "../data/config.js";

export default class {
  command: string;
  args: string[];
  isCommand: boolean;
  message: Message;
  _voiceChannel: VoiceChannel | undefined;
  constructor(message: Message) {
    this.message = message;
    this.command = message.content.substring(prefix.length).split(" ")[0];
    this.args = message.content.substring(
      prefix.length + this.command.length + 1,
    ).split(" ");
    this.isCommand = message.content.startsWith(prefix);
  }
  get voiceChannel() {
    if (this._voiceChannel) return this._voiceChannel;
    const recipientVoiceChan = this.message?.mentions?.members?.first()?.voice
      ?.channel;
    const authorVoiceChan = this.message.member?.voice?.channel;
    const theChannel = recipientVoiceChan || authorVoiceChan;
    return theChannel?.type === "GUILD_VOICE" ? theChannel : null;
  }
}
