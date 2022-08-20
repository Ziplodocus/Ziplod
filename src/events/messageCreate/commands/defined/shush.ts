import ExtendedMessage from "../../../../classes/ExtendedMessage.js";

export default async ( msg: ExtendedMessage ) => {
    msg.message.reply( "No, you shush you bum" );
    return msg;
};