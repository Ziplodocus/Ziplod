import { readdirSync, writeFileSync } from 'fs';
import { pathTo } from '../helperFunctions/helpers.js';

// This function updates the not "JSON" file with data from the file structure indicating which dynamic sound
// commands exist and how many tracks there are for each
export let soundTracks: { [index: string]: { [index: string]: number; }; } = {};

async function generateTrackCache() {
    const audioDir = './assets/soundTracks';
    const soundTracksFolders = readdirSync( audioDir );
    const cacheable = soundTracksFolders.filter( folder => folder.endsWith( 'Tracks' ) );
    cacheable.forEach( trackTypeFull => {
        const trackType = trackTypeFull.replace( 'Tracks', '' );
        const trackCount = readdirSync( pathTo( trackTypeFull, audioDir ) ).length;
        if ( !soundTracks[trackType] ) soundTracks[trackType] = { count: trackCount };
        else if ( soundTracks[trackType].count !== trackCount ) soundTracks[trackType].count = trackCount;
    } );
}

// Function to set up the cron job (once every 5mins) and to run once on start in case of file additions
export function soundTracksUpdater() {
    generateTrackCache();
    setInterval( generateTrackCache, 1000 * 60 * 60 * 5 );
}
