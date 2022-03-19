import extendedMessage from "../../../../classes/extendedMessage";

export default ( msg: extendedMessage ) => {
    msg.message.reply( "No, you shush you bum" );
    return msg;
};