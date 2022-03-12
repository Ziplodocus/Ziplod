import {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
} from "@discordjs/voice";
import { prefix, ThemeTro } from "../data/config.js";
import { client, rootDir } from "../ziplod.js";
import { createReadStream, existsSync, readdirSync } from "fs";
import { join as joinPath, relative as relativePath } from "path";
import { Channel, TextChannel, VoiceChannel, VoiceState } from "discord.js";

//////////////////////////
//      FUNCTIONS      //
/////////////////////////

// Deletes commands the last 50 commands in the given text channel
export function delCommands(channel: TextChannel, time = 11000) {
	channel.messages.fetch({ limit: 50 }).then((messages) => {
		messages
			.filter(message => message.content.startsWith(prefix) || message.author.client === client)
			.each(message => setTimeout(() => message.delete(), time));
	});
}

// Plays in the given channel the audio file at the given file path
export function playSound(audioPath: string, channel: VoiceChannel) {
	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator
	});
	const readStream = createReadStream(audioPath);
	const player = createAudioPlayer();
	const resource = createAudioResource(readStream);
	player.play(resource);
	connection.subscribe(player);
	console.log(`Now playing... ${audioPath} in ${channel.name}`);
}

//Determines and plays the theme music ( if any ) of a user
export function playTheme(state: VoiceState, themeType: ThemeTro) {
	if (state?.channel?.type !== "GUILD_VOICE") return;
	const dude = state?.member?.user?.tag;
	let i = 0;
	while (existsSync(`./assets/soundTracks/themeSongs/${dude}/${themeType}-${i}.mp3`)) { i++; }
	if (i === 0) {
		console.log(`No ${themeType} music for ${dude}`);
		return false;
	}
	const randThemeNo = Math.floor(Math.random() * i);
	const themePath = `./assets/soundTracks/themeSongs/${dude}/${themeType}-${randThemeNo}.mp3`;
	const voiceChan = state.channel;
	console.log(`Playing ${dude}'s ${themeType}ro music`);
	playSound(themePath, voiceChan);
}

// Returns a random time between 10 seconds and 10 minutes
export function randomTime() {
	return 1000 * 60 * 5 + Math.random() * 1000 * 60 * 25;
}

// Plays a random meme in the given voice channel
export function playRandomMeme(channel: Channel) {
	console.log(channel.type);
	if (channel.type !== "GUILD_VOICE") return;
	let i = 0;
	while (existsSync(`./assets/soundTracks/memeTracks/meme${i}.mp3`)) i++;
	const rndInt = Math.floor(Math.random() * i);
	const audioPath = relPathTo(
		`./assets/soundTracks/memeTracks/meme${rndInt}.mp3`
	);
	playSound(audioPath, channel);
}

export function pathTo(to: string, from = rootDir) {
	return joinPath(from, to);
}
export function relPathTo(to: string) {
	const toPath = pathTo(to);
	return relativePath(".", toPath);
}

// Retrieves all directories within the given directory
export function getDirs(dirPath: string) {
	return readdirSync(dirPath, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name)
}