import {writeFileSync} from 'fs';
import { textToSpeechAuth } from '../data/config';

export default async () => {
	const voicesres = await fetch('https://texttospeech.googleapis.com/v1/voices?key='+textToSpeechAuth);
	const {voices} = await voicesres.json();
	let codes: string[] = [];
	voices.forEach((element: { languageCodes: string[]; }) => {
		codes.push(element.languageCodes[0]);
	});
	// write array to a text file
	writeFileSync('langCodes.txt', codes.join('\n'));
}