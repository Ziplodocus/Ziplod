import extendedMessage from "../../../../classes/extendedMessage.js";
import { playAudioStream } from "../../../../helperFunctions/helpers.js";
import { textToSpeechAuth, langTags } from "../../../../data/config.js";
import fetch from 'node-fetch';
import {Readable} from 'stream';

export default async function(msg : extendedMessage) {
    const voiceChan = msg.voiceChannel();
    if (!voiceChan) return msg.message.reply( "\n Someone has to be in a voice channel don' they? idiot." );
    const stringToSpeak = msg.args.filter(arg => !arg.startsWith('<@')).join(' ');
    const audioStream = await fetchAudioBase64FromString(stringToSpeak);
    if(!audioStream) return msg.message.reply('There was an error with the request!');
    playAudioStream(audioStream, voiceChan);
}

async function fetchAudioBase64FromString(string: string) : Promise<Readable | undefined> {
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
    console.log(options);
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${textToSpeechAuth}`, options);
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