import extendedMessage from "../../../../classes/extendedMessage";


export default ( msg: extendedMessage ) => {
    msg.message.reply( 'Smoother than yours.' );
    return msg;
};