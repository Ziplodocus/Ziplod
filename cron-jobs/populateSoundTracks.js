import { readdirSync, writeFileSync } from 'fs';
import { pathTo } from '../helperFunctions/helpers.js';

const soundTracks = {};
// This function updates the not "JSON" file with data from the file structure indicating which dynamic sound
// commands exist and how many tracks there are for each
async function updateTrackCache() {
    const audioDir = './assets/soundTracks';
    const soundTracksFolders = readdirSync(audioDir);
    const cacheable = soundTracksFolders.filter( folder => folder.endsWith('Tracks') );
    cacheable.forEach( trackTypeFull => {
        const trackType = trackTypeFull.replace('Tracks', '');
        const trackCount = readdirSync( pathTo( trackTypeFull, audioDir ) ).length;
        if ( !soundTracks[trackType] ) soundTracks[trackType] = {count: trackCount};
        else if ( soundTracks[trackType].count !== trackCount ) soundTracks[trackType].count = trackCount;
    })
    const fileContent = 'export const soundTracks = ' + JSON.stringify(soundTracks, null, 2);
    writeFileSync( pathTo( './data/soundTracks.js' ), fileContent );
}

// Function to set up the cron job (once every 24hrs) and to run once on start in case of file additions
export function cacheUpdater() {
    updateTrackCache();
    setInterval( updateTrackCache, 1000 * 60 * 60 * 24 );
}
