import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import { ReadStream } from "fs";
import { VoiceChannel, VoiceState } from "discord.js";
import { Readable } from "stream";
import { langTags, ttsAuth } from "../data/config.js";
import { Files, Themes, Tracks } from "../ziplod.js";
import fetch from "node-fetch";
import { randItem } from "./other.js";

// Plays in the given channel the audio file at the given file path
export async function playSound(name: string, channel: VoiceChannel) {
  const soundStream = await Files.get(`sounds/${name}.mp3`);
  if (soundStream instanceof Error) return soundStream;

  const isSuccess = await playAudioStream(soundStream, channel);
  if (isSuccess === true) {
    console.log(`Playing "${name}" in channel "${channel.name}"`);
  }

  return isSuccess;
}

//Determines and plays the theme music ( if any ) of a user
export async function playTheme(
  state: VoiceState,
  type: "intro" | "outro",
  name?: string,
) {
  if (state?.channel?.type !== "GUILD_VOICE") {
    console.error("Channel is not of type VoiceChannel");
    return new Error(
      "You can only play your theme in a voice channel you're in dumb dumb.",
    );
  }

  const tag = state?.member?.user.tag;
  if (!tag) {
    console.error(`This voice state has no guild member associated 🤔`);
    return new Error(`Who are you? 🤔`);
  }
  const themes = await Themes.themes(tag, type);
  if (name && !themes.has(name)) {
    return new Error(`Theme ${name} doesn't exist!`);
  }

  const themeToPlay = name || randItem(themes);
  if (!themeToPlay) return Error(`You have no ${type} themes`);

  const getResult = await Themes.get(themeToPlay, type, tag);
  if (getResult instanceof Error) {
    return getResult;
  }

  const playResult = await playAudioStream(getResult, state.channel);
  if (playResult === true) {
    console.log(
      `Playing ${tag}'s ${type} music ${themeToPlay} in ${state.channel.guild.name}/${state.channel.name}`,
    );
  }
  return playResult;
}

export async function playTrack(
  type: string,
  num: number,
  channel: VoiceChannel,
) {
  const getResult = await Tracks.get(type, num);
  if (getResult instanceof Error) {
    return getResult;
  }

  const playResult = await playAudioStream(getResult, channel);
  if (playResult === true) {
    console.log(
      `Playing tracks/${type}/${num} in ${channel.guild.name}/${channel.name}`,
    );
  }
  return playResult;
}

// Plays a random meme in the given voice channel
export async function playRandomMeme(channel: VoiceChannel) {
  // This ensures the channel is of type VoiceChannel
  if (channel.type !== "GUILD_VOICE") {
    console.error(
      `Can't play random meme in channel ${channel.name} as it's a ${channel.type}`,
    );
    return new Error("Channel is not of type VoiceChannel");
  }
  const memeCount = Tracks.count.meme;
  const rndInt = Math.floor(Math.random() * memeCount);
  return playTrack("meme", rndInt, channel);
}

export async function speak(text: string, voiceChan: VoiceChannel) {
  const stream = await audioStreamFromString(text);
  if (stream instanceof Error) return stream;

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
    console.error(err);
    return new Error(
      `Something went wrong streaming the audio to channel ${channel.name} 🤔`,
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
  try {
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
            languageCode:
              (langTags[Math.round(Math.random() * langTags.length)]),
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
      console.error(
        "Text to speech error!: " + response.status + " " + response.statusText,
      );
      return new Error(
        "Text to speech error!: " + response.status + " " + response.statusText,
      );
    }
    // decode base64 as mp3
    return base64ToMP3(audioContent);
  } catch (err) {
    console.error(err);
    return new Error(
      "Text to speech error!",
    );
  }
}
