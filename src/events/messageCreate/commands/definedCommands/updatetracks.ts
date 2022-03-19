import extendedMessage from "../../../../classes/extendedMessage.js";
import { generateTrackCache, soundTracks } from "../../../../cron-jobs/soundTracks.js";


export default async ( msg: extendedMessage ) => {
    generateTrackCache();
    return msg;
};