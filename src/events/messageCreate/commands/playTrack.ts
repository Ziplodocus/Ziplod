import { playTrack } from "../../../utility/sounds.js";
import ExtendedMessage from "../../../classes/ExtendedMessage.js";
import { Tracks } from "../../../ziplod.js";

export default async (msg: ExtendedMessage): Promise<void> => {
  const voiceChan = msg.voiceChannel;
  if (!voiceChan) {
    msg.message.reply(
      "\n Someone has to be in a voice channel, don't they? idiot.",
    );
    return;
  }

  // Check if command contained specific number and fetch number of tracks
  const numArg = msg.args.find((arg) => !isNaN(parseInt(arg)));
  const num = numArg !== undefined && Math.abs(parseInt(numArg));
  const trackMax = Tracks.count[msg.command];

  // If the track number exists play that one else play a random track
  const trackNo = (num && num < trackMax)
    ? num
    : Math.floor(Math.random() * trackMax);

  const result = await playTrack(msg.command, trackNo, voiceChan);

  if (result instanceof Error) msg.message.reply(result.message);

  return;
};
