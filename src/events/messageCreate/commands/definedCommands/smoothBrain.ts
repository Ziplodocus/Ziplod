import extendedMessage from "../../../../classes/extendedMessage.js";


export default async ( msg: extendedMessage ) => {
    msg.message.reply( 'Smoother than yours.' );
    return msg;
};