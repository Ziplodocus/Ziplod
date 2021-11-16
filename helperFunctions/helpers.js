import { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';
import { prefix } from '../data/config.js';
import { client, rootDir } from '../ziplod.js';
import { createReadStream, existsSync } from 'fs';
import { join as joinPath, relative as relativePath } from 'path';

//////////////////////////
//      FUNCTIONS      //
/////////////////////////

// Deletes commands the last 50 commands in the given text channel
export function delCommands(channel, time = 11000) {
    channel.messages
        .fetch({ limit: 50 })
        .then(messages => {
            messages
                .filter(message => message.content.startsWith(prefix) || message.author.client == client)
                .each(message => setTimeout(() => message.delete(), time))
        });
}

// Plays in the given channel the audio file at the given file path
export function playSound(audioPath, channel) {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    })
    const readStream = createReadStream(audioPath);
    const player = createAudioPlayer();
    const resource = createAudioResource(readStream);
    player.play(resource);
    connection.subscribe(player);
    console.log(`Now playing... ${audioPath} in ${channel.name}`)
}

//Determines and plays the theme music ( if any ) of a user
export function playTheme(state, themeType) {
    const dude = state.member.user.tag;
    let i = 0;
    while (existsSync(`./assets/soundTracks/dudeTracks/${dude}/${themeType}-${i}.mp3`)) { i++ };
    if (i === 0) {
        console.log(`No ${themeType} music for ${dude}`);
        return false
    };
    const randThemeNo = Math.floor(Math.random() * i)
    const themePath = `./assets/soundTracks/dudeTracks/${dude}/${themeType}-${randThemeNo}.mp3`;
    const voiceChan = state.channel;
    console.log(`Playing ${dude}'s ${themeType}ro music`);
    playSound(themePath, voiceChan);
}

// Returns a random time between 10 seconds and 10 minutes
export function randomTime() {
    return 1000 * 10 + Math.random() * 1000 * 60 * 10;
}

// Plays a random meme in the given voice channel
export function playRandomMeme(channel) {
    if (channel.isVoice()) {
        let i = 0;
        while (existsSync(`./assets/soundTracks/memeTracks/meme${i}.mp3`)) i++;
        const rndInt = Math.floor(Math.random() * i);
        const audioPath = relPathTo(`./assets/soundTracks/memeTracks/meme${rndInt}.mp3`);
        playSound(audioPath, channel);
    }
}

export function pathTo(to, from = rootDir) {
    return joinPath(from, to);
}
export function relPathTo(to) {
    const toPath = pathTo(to);
    return relativePath('.', toPath);
}