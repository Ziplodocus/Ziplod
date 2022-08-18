import {Bucket, Storage} from '@google-cloud/storage';
import {Readable} from 'stream';
import { escapeRegExp } from '../utility/other.js';


// Must have a Google cloud service account key and an env variable
// named GOOGLE_APPLICATION_CREDENTIALS set as the path pointing to the json key.
export default class ZiplodStorage {
    bucket: Bucket;
    trackCount: Record<string, number>;
    themeCount: Record<string, Record<string, number>>;
    // Connect to google api and connect to named bucket
    constructor(bucketName = 'ziplod-assets') {
        const bucket = new Storage();
        this.bucket = bucket.bucket(bucketName);
        // Assign a track count with the purpose to avoid requesting tracks that don't exist
        this.trackCount = {};
        this.themeCount = {};
        this.updateTrackCount();
    }

    // Returns a read stream to the named mp3 file in the sounds folder
    async getSound(name:string) : Promise<Readable | undefined> {
        console.log( `Getting sound ${name}...`);
        const path = `sounds/${name}.mp3`;
        return this.bucket.file(path).createReadStream();
    }

    // Returns readstream of mp3 file given by the requested track type and number
    async getTrack(type : string, number : number) : Promise<Readable | undefined>{
        console.log(`Getting track ${type}${number}...`);
        const path = `soundTracks/${type}Tracks/${type}${number}.mp3`;
        return this.bucket.file(path).createReadStream();
    }

    // Uploads a stream to storage bucket in the trackType subfolder in soundtracks
    async addTrack(type : string, number : number, stream : NodeJS.ReadableStream) {
        console.log(`Attempting to register ${type}${number}...`);
        const path = `soundTracks/${type}Tracks/${type}${number}.mp3`;
        const file = this.bucket.file(path);
        // Shouldn't be the case that the file exists as the number of tracks
        //is kept track of, but not harm to have a guard
        const exists = (await file.exists())[0];
        if (exists) return console.log('This track already exists!');
        stream.pipe(file.createWriteStream());
        console.log('Register succesful.');
        this.trackCount[type]++;
        console.log(this.trackCount);
    }

    // Looks at all the files in the soundTracks bucket,
    // and updates the trackCount property based on the files there.
    async updateTrackCount() : Promise<void> {
        const res = await this.bucket.getFiles({
            autoPaginate: false,
            prefix: 'soundTracks/'
        });
        const allFiles = res[0];
        const tempCount : Record<string, number> = {};
        allFiles.forEach( file => {
            const trackType = new RegExp('(?<=/).*(?=Tracks/)').exec(file.name);
            if( !Array.isArray(trackType) ) return;
            if (tempCount[trackType[0]]) {
                tempCount[trackType[0]]++;
            } else {
                tempCount[trackType[0]] = 1;
            };
            this.trackCount = tempCount;
        })
    }

    // Returns the given users given intro/outro theme mp3 file as a stream
    async getTheme(user:string, themeType : string) : Promise<Readable | undefined> {
        console.log( `Getting ${user}'s ${themeType}...`);
        const path = `soundTracks/themeSongs/${user}/${themeType}`;
        // Doesn't track number of themes so will need to see all availble to determine which one to fetch.
        const themes = (await this.bucket.getFiles({prefix: path}))[0];
        const file = themes[Math.floor(Math.random() * themes.length)];
        if (!file) return undefined;
        return file.createReadStream();
    }

    async addTheme(userTag : string, type : string, stream : NodeJS.ReadableStream) : Promise<void> {
        const count = await this.checkThemeCount(userTag);
        const num = count[type];
        console.log(`Attempting to register ${type}-${num}...`);
        const path = `soundTracks/themeSongs/${userTag}/${type}-${num}.mp3`;
        const file = this.bucket.file(path);
        const exists = (await file.exists())[0];
        if (exists) return console.log('This theme already exists!');
        stream.pipe(file.createWriteStream());
        console.log('Register succesful.');
    }

    async checkThemeCount(userTag : string) : Promise<Record<string, number>> {
        const res = await this.bucket.getFiles({
            autoPaginate: false,
            prefix: `soundTracks/themeSongs/${userTag}`
        });
        const allFiles = res[0];
        const tempCount : Record<string, number> = {};
        allFiles.forEach( file => {
            console.log(file.name);
            const trackType = new RegExp(`(?<=${escapeRegExp(userTag)}/).*?(?=-)`).exec(file.name);
            if( !Array.isArray(trackType) ) return;
            if (tempCount[trackType[0]]) {
                tempCount[trackType[0]]++;
            } else {
                tempCount[trackType[0]] = 1;
            };
            this.themeCount[userTag] = tempCount;
        })
        return tempCount;
    }
}