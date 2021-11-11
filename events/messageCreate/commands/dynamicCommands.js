
import { playSound } from '../../../helper_functions/helpers.js';
import { existsSync } from 'fs';

export function dynamicCommands(message) {
    return () => {
        let i = 0;
        while (existsSync(`./assets/${message.command}Tracks/${message.command}${i}.mp3`)) {i++};
        if (i === 0) return message.reply('\n That is not one of my many powerful commands tiny person');
        if (!message.voiceChannel) return message.reply('\n Someone has to be in a voice channel don\'t they? idiot.');
        const rndInt = Math.floor(Math.random()*i);
        const audioPath = `./assets/${message.command}Tracks/${message.command}${rndInt}.mp3`;
        playSound(audioPath, message.voiceChannel);
    }
}