import extendedMessage from "../../../../classes/extendedMessage.js";

export default ( msg: extendedMessage ) => {
    msg.message.reply( "No, you shush you bum" );
    return msg;
};