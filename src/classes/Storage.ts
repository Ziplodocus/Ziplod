import {Bucket, Storage} from '@google-cloud/storage';

// Must have a Google cloud service account key and an env variable
// named GOOGLE_APPLICATION_CREDENTIALS set as the path pointing to the json key.
export default class ZiplodStorage {
    bucket: Bucket;
    trackCount: Record<string, number>;
    constructor() {
        const bucket = new Storage();
        this.bucket = bucket.bucket('ziplod-assets');
        this.trackCount = {}
    }
    async getTheme(user:string, themeType : string) {
        console.log( `Getting ${user}'s ${themeType}...`);
        const path = `soundTracks/themeSongs/${user}/${themeType}`;
        const themes = (await this.bucket.getFiles({prefix: path}))[0];
        const file = themes[Math.floor(Math.random() * themes.length)];
        return file.createReadStream();
    }
    async getSound(name:string) {
        console.log( `Getting sound ${name}...`);
        const path = `sounds/${name}.mp3`;
        return this.bucket.file(path).createReadStream();
    }

    async getTrack(type : string, number : number) {
        console.log(`Getting track ${type}${number}...`);
        const path = `soundTracks/${type}Tracks/${type}${number}.mp3`;
        return this.bucket.file(path).createReadStream();
    }
    async addTrack(type : string, number : number, stream : NodeJS.ReadableStream) {
        console.log(`Attempting to register ${type}${number}...`);
        const path = `soundTracks/${type}Tracks/${type}${number}.mp3`;
        const file = this.bucket.file(path);
        const exists = (await file.exists())[0];
        if (exists) return console.log('This track already exists!');
        stream.pipe(file.createWriteStream());
        console.log('Register succesful.');
        await this.updateTrackCount();
        console.log(this.trackCount);
    }
    async updateTrackCount() : Promise<void> {
        const res = await this.bucket.getFiles({
            autoPaginate: false,
            prefix: 'soundTracks/'
        });
        const allFiles = res[0];
        allFiles.forEach( file => {
            const trackType = new RegExp('(?<=/).*(?=Tracks/)').exec(file.name);
            if( !Array.isArray(trackType) ) return;
            if (this.trackCount[trackType[0]]) {
                this.trackCount[trackType[0]]++;
            } else {
                this.trackCount[trackType[0]] = 1;
            } ;
        })
    }
}