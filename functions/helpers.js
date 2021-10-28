import { joinVoiceChannel, createAudioPlayer, createAudioResource } from '@discordjs/voice';
import { prefix } from '../config.js';
import { client } from '../ziplod.js';
import { existsSync } from 'fs';
// import { channel } from 'diagnostics_channel';


//////////////////////////
//      FUNCTIONS      //
/////////////////////////

export function delCommands(channel, time=11000) {
    channel.messages
    .fetch({limit:50})
    .then(messages => {
        messages
        .filter( message => message.content.startsWith(prefix) || message.author.client == client )
        .each( message => setTimeout( ()=>message.delete(), time ))
    });
}

export function playSound(audioPath, channel) {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    })
    const player = createAudioPlayer();
    const resource = createAudioResource(audioPath);
    player.play(resource);
    connection.subscribe(player);
    console.log(`Now playing... ${audioPath} in ${channel.name}`)
}

//Plays intro and outro music
export function playTheme(state, themeType) {
    const dude = state.member.user.tag;
    let i = 0;
    while (existsSync(`./assets/dudeTracks/${dude}/${themeType}-${i}.mp3`)) {i++};
    if (i === 0) {
        console.log(`No ${themeType} music for ${dude}`);
        return false
    };
    const randThemeNo = Math.floor(Math.random()*i)
    const themePath = `./assets/dudeTracks/${dude}/${themeType}-${randThemeNo}.mp3`;
    const voiceChan = state.channel;
    console.log(`Playing ${dude}'s ${themeType}ro music ${themePath}`);
    playSound(themePath, voiceChan);
}

export function randomTime() {
    return 1000*10 + Math.random()*1000*60*10;
}

export function playRandomMeme(channel) {
    if( channel.isVoice() ) {
        let i=0;
        while( existsSync(`./assets/memeTracks/meme${i}.mp3`) ) {i++};
        const rndInt = Math.floor(Math.random()*i);
        const audioPath = `./assets/memeTracks/meme${rndInt}.mp3`;
        playSound(audioPath, channel);
    }
}
