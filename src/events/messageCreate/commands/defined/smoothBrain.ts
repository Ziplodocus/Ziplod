import ExtendedMessage from "../../../../classes/ExtendedMessage.js";


export default async function( msg: ExtendedMessage ) {
    msg.message.reply( 'Much smoother than yours.' );
    return msg;
};