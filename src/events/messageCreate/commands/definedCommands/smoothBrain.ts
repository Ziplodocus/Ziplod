import extendedMessage from "../../../../classes/extendedMessage.js";


export default ( msg: extendedMessage ) => {
    msg.message.reply( 'Smoother than yours.' );
    return msg;
};