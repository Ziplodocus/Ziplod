import ExtendedMessage from "../../../../classes/ExtendedMessage";
import fetch from 'node-fetch';
import { Storage } from '../../../../ziplod.js';

export default async ( msg: ExtendedMessage ) => {
    const attachment = msg.message.attachments.first();
    const type = msg.args[0];
    if ( !type ) return msg.message.reply( 'Register as what you neanderthal?' );
    if ( !attachment ) return msg.message.reply( 'Attach an mp3 dimwit.' );
    if ( attachment.size > 2000000 ) return msg.message.reply( 'File is larger than your mother, I will not take it.' );
    if ( attachment.contentType !== 'audio/mpeg' ) return msg.message.reply( 'I only take mp3s you dissident.' );
    try {
        const typeCount = Storage.trackCount[type] || 0;
        // fetch the file from the external URL
        const response = await fetch( attachment.url );
        // Add the track to google cloud storage
        Storage.addTrack(type, typeCount, response.body);
        return true;
    } catch ( error ) {
        console.log( error );
        return false;
    }
};