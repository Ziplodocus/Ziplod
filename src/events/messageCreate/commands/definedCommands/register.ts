import extendedMessage from "../../../../classes/extendedMessage";
import fetch from 'node-fetch';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { soundTracks, generateTrackCache } from "../../../../cron-jobs/soundTracks.js";

export default async ( msg: extendedMessage ) => {
    const attachment = msg.message.attachments.first();
    const type = msg.args[0];
    if ( !type ) return msg.message.reply( 'Register as what you neanderthal?' );
    if ( !attachment ) return msg.message.reply( 'Attach an mp3 dimwit.' );
    if ( attachment.size > 2000000 ) return msg.message.reply( 'File is larger than your mother, I will not take it.' );
    if ( attachment.contentType !== 'audio/mpeg' ) return msg.message.reply( 'I only take mp3s you dissident.' );
    try {
        await generateTrackCache();
        const typeCount = soundTracks[type]?.count || 0;

        // fetch the file from the external URL
        const response = await fetch( attachment.url );
        const fileDir = `./assets/soundTracks/${type}Tracks/`;
        if ( !existsSync( fileDir ) ) mkdirSync( fileDir );
        const filePath = `${fileDir}${type}${typeCount}.mp3`;
        response.body.pipe(
            createWriteStream( filePath )
        );
        // Gives a bit of time for the file to establish on the system. Was having issues without the timeout.
        setTimeout( generateTrackCache, 2000 );
        return true;
    } catch ( error ) {
        console.log( error );
        return false;
    }
}; 