import extendedMessage from "../../../../classes/extendedMessage";
import { playAudioStream } from "../../../../helperFunctions/helpers";
import { textToSpeechAuth } from "../../../../data/config";

export default async function(msg : extendedMessage) {
    const voiceChan = msg.voiceChannel();
    if (!voiceChan) return msg.message.reply( "\n Someone has to be in a voice channel don' they? idiot." );
    const stringToSpeak = msg.args.join(' ');
    const audioStream = await fetchAudioStreamFromString(stringToSpeak);
    playAudioStream(audioStream, voiceChan);
}

async function fetchAudioStreamFromString(string: string) : Promise<string> {
    const options : RequestInit  = {
        headers: {
            authorization: `Bearer ${textToSpeechAuth}`,
            "content-type": "application/json; charset=utf8",
        },
        method: "POST",
        body: JSON.stringify({
            input: {
                text: string
            },
            voice: {
                languageCode: "en-gb",
                name: "en-GB-Standard-A",
                ssmlGender: "FEMALE"
            },
            audioConfig: {
                audioEncoding: "MP3"
            }
        }),
    }
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize`, options);
    const {audioContent} = await response.json();
    console.log(response, audioContent);
    return audioContent;
}