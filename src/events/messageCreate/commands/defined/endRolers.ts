import ExtendedMessage from "../../../../classes/ExtendedMessage.js";
import checkPermissions from "../../../../utility/checkPermissions.js";

export default async ( msg: ExtendedMessage ) => {
    if ( !checkPermissions( msg ) ) return;
    let argRole = msg.args.join( " " ) || "Custom Gamer";
    let replyData: string[] = [];
    const roles = await msg.message.guild?.roles.fetch( undefined, { cache: true } );
    const therole = roles?.find( role => role.name === argRole );
    if ( therole ) {
        const gamers = therole.members;
        gamers.forEach( gamer => {
            replyData.push( gamer.user.tag );
            gamer.roles.remove( therole );
        } );
        msg.message.reply(
            replyData.join( ",\n" ) +
            "\n have had the role " +
            argRole +
            " successfully removed. Really, really. For real this time."
        );
    } else msg.message.reply( "There is no " + argRole + " role :(" );
    return msg;
};