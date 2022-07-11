import {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource
} from "@discordjs/voice";
import { ReadStream } from "fs";
import { Channel, VoiceChannel, VoiceState } from "discord.js";
import { Readable } from 'stream';
import { langTags, ttsAuth } from "../data/config.js";
import { Storage } from '../ziplod.js';
import fetch from 'node-fetch';

/////////////////////////
//      FUNCTIONS      //
/////////////////////////

// Plays in the given channel the audio file at the given file path
export async function playSound( name : string, channel: VoiceChannel ) {
	console.log('Attempting to play sound: ' + name + ' in channel: ' + channel.name);
	const soundStream = await Storage.getSound(name);
	playAudioStream(soundStream, channel);
}

export async function playAudioStream(stream : string | ReadStream | Readable, channel : VoiceChannel) {
	const connection = joinVoiceChannel( {
		channelId: channel.id,
		guildId: channel.guild.id,
		// @ts-ignore Apparently due to version mismatch of Discord Api and Discord.js libraries
		adapterCreator: channel.guild.voiceAdapterCreator
	} );
	const player = createAudioPlayer();
	const resource = createAudioResource(stream);
	connection.subscribe(player);
	player.play(resource);
}

export async function speak(text: string, voiceChan : VoiceChannel) {
    const stream = await fetchAudioStreamFromString(text);
    if(stream) {
        playAudioStream(stream, voiceChan);
        console.log('Saying '+text+' in channel: '+voiceChan.name);
        return true;
    } else {
        console.log('Speaking failed :o');
        return false;
    }
}

// Returns a readable Audiostream, from text, by calling the Google TTS api.
export async function fetchAudioStreamFromString(string: string) : Promise<Readable | undefined> {
    const options = {
        headers: {
            "content-type": "application/json; charset=utf8",
        },
        method: "POST",
        body: JSON.stringify({
            input: {
                text: string
            },
            voice: {
                languageCode: (langTags[Math.round(Math.random() * langTags.length)]),
                ssmlGender: (Math.random() > 0.5) ? "MALE" : "FEMALE"
            },
            audioConfig: {
                audioEncoding: "MP3"
            }
        }),
    }
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${ttsAuth}`, options);
    const {audioContent} = await response.json();
    if(response.status !== 200) {
        console.error("Text to speech error!: "+response.status+' '+response.statusText);
        return undefined;
    }
    // decode base64 as mp3
    const base64Decoded = Buffer.from(audioContent, 'base64');
    const readable = new Readable();
    readable.push(base64Decoded);
    readable.push(null);
    return readable;
}

//Determines and plays the theme music ( if any ) of a user
export async function playTheme( state: VoiceState, themeType: string ) {
	if ( state?.channel?.type !== "GUILD_VOICE" ) return;
	const dude = state?.member?.user?.tag;
    if (!dude) return false;
	const voiceChan = state.channel;
    const themeStream = await Storage.getTheme(dude, themeType);
	console.log( `Playing ${dude}'s ${themeType}ro music` );
	playAudioStream( themeStream, voiceChan );
}

// Plays a random meme in the given voice channel
export async function playRandomMeme( channel: Channel ) {
	// This ensures the channel is of type VoiceChannel
	if ( channel.type !== "GUILD_VOICE" ) return;
	const memeCount = Storage.trackCount.meme;
	const rndInt = Math.floor( Math.random() * memeCount );
    const memeStream = await Storage.getTrack('meme', rndInt);
	// @ts-ignore Typescript doens't seem to pick up that channel is type voiceChannel here.
	playAudioStream( memeStream, channel );
}