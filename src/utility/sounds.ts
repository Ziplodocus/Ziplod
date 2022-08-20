import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import { ReadStream } from "fs";
import { VoiceChannel, VoiceState } from "discord.js";
import { Readable } from "stream";
import { langTags, ttsAuth } from "../data/config.js";
import { Storage } from "../ziplod.js";
import fetch from "node-fetch";
import { basename } from "path";

/////////////////////////
//      FUNCTIONS      //
/////////////////////////

// Plays in the given channel the audio file at the given file path
export async function playSound(name: string, channel: VoiceChannel) {
  console.log(
    `Getting "${name}"...`,
  );
  const soundStream = await Storage.get(`sounds/${name}.mp3`);
  if (soundStream instanceof Error) {
    console.error(soundStream.message);
    return soundStream;
  }
  const success = await playAudioStream(soundStream, channel);
  if (success === true) {
    console.log(`Playing "${name}" in channel "${channel.name}"`);
  }
  return success;
}

//Determines and plays the theme music ( if any ) of a user
export async function playTheme(
  state: VoiceState,
  type: string,
): Promise<true | Error> {
  if (state?.channel?.type !== "GUILD_VOICE") {
    return new Error("Channel is not of type VoiceChannel");
  }
  const dude = state?.member?.user.tag;
  if (!dude) {
    return new Error(`This voice state has no guild member associated 🤔`);
  }
  const voiceChan = state.channel;

  const count = Storage.themeCount?.[dude] ||
    await Storage.checkThemeCount(dude);

  if (count[type] === 0) {
    console.error(`${dude} has no ${type}`);
    return new Error(`${dude} has no ${type}`);
  }

  // Gets a random existing theme
  console.log(`Getting ${dude}'s ${type}...`);
  const getResult = await Storage.get(
    `soundTracks/themeSongs/${dude}/${type}-${
      Math.floor(Math.random() * count[type])
    }.mp3`,
  );
  if (getResult instanceof Error) {
    console.error(
      `Failed to retrieve ${dude}'s ${type} music : ${getResult.message}`,
    );
    return getResult;
  }

  const playResult = await playAudioStream(getResult, voiceChan);
  if (playResult === true) {
    console.log(`Playing ${dude}'s ${basename(type, ".mp3")} music`);
  }
  return playResult;
}

export async function playTrack(
  type: string,
  num: number,
  channel: VoiceChannel,
) {
  console.log(`Getting track "${type}${num}"...`);
  const path = `soundTracks/${type}Tracks/${type}${num}.mp3`;
  const stream = await Storage.get(path);
  if (stream instanceof Error) {
    console.error(stream.message);
    return stream;
  }

  const result = await playAudioStream(stream, channel);
  if (result === true) {
    console.log(`Playing track "${type}${num}" in channel "${channel.name}"`);
  }
  return result;
}

// Plays a random meme in the given voice channel
export async function playRandomMeme(
  channel: VoiceChannel,
): Promise<true | Error> {
  // This ensures the channel is of type VoiceChannel
  if (channel.type !== "GUILD_VOICE") {
    return new Error("Channel is not of type VoiceChannel");
  }
  const memeCount = Storage.trackCount.meme;
  const rndInt = Math.floor(Math.random() * memeCount);
  return playTrack("meme", rndInt, channel);
}

export async function speak(text: string, voiceChan: VoiceChannel) {
  const stream = await audioStreamFromString(text);
  if (stream instanceof Error) {
    console.error(stream.message);
    return false;
  }
  const isSuccess = await playAudioStream(stream, voiceChan);
  if (isSuccess === true) {
    console.log(`Saying "${text}" in channel ${voiceChan.name}`);
  }
  return isSuccess;
}

async function playAudioStream(
  stream: ReadStream | Readable,
  channel: VoiceChannel,
) {
  try {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      // @ts-ignore Apparently due to version mismatch of Discord Api and Discord.js libraries
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
    const player = createAudioPlayer();
    const resource = createAudioResource(stream);
    connection.subscribe(player);
    player.play(resource);
    return true;
  } catch (err) {
    console.log(err);
    return new Error(
      `Something went wrong playing the stream in channel ${channel.name}`,
    );
  }
}

function base64ToMP3(content: string) {
  const base64Decoded = Buffer.from(content, "base64");
  const readable = new Readable();
  readable.push(base64Decoded);
  readable.push(null);
  return readable;
}

// Returns a readable Audiostream, from text, by calling the Google TTS api.
async function audioStreamFromString(
  string: string,
) {
  const response = await fetch(
    `https://texttospeech.googleapis.com/v1/text:synthesize?key=${ttsAuth}`,
    {
      headers: {
        "content-type": "application/json; charset=utf8",
      },
      method: "POST",
      body: JSON.stringify({
        input: {
          text: string,
        },
        voice: {
          languageCode: (langTags[Math.round(Math.random() * langTags.length)]),
          ssmlGender: (Math.random() > 0.5) ? "MALE" : "FEMALE",
        },
        audioConfig: {
          audioEncoding: "MP3",
        },
      }),
    },
  );

  const { audioContent } = await response.json();

  if (response.status !== 200) {
    return new Error(
      "Text to speech error!: " + response.status + " " + response.statusText,
    );
  }
  // decode base64 as mp3
  return base64ToMP3(audioContent);
}
