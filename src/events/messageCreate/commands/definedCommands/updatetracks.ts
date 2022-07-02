import ExtendedMessage from "../../../../classes/ExtendedMessage.js";
import {Storage} from "../../../../ziplod.js";


export default async ( msg: ExtendedMessage ) => {
    Storage.updateTrackCount();
    return msg;
};