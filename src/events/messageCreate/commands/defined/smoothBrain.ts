import ExtendedMessage from "../../../../classes/ExtendedMessage.js";


export default async function( msg: ExtendedMessage ) {
    msg.message.reply( 'Smoother than yours.' );
    return msg;
};