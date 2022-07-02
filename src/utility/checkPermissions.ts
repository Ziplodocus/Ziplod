import ExtendedMessage from "../classes/ExtendedMessage.js";
import { client } from "../ziplod.js";

export default ( msg: ExtendedMessage ) => {
    const guildId = msg.message.guild?.id;
    const userId = client?.user?.id;
    if ( !guildId || !userId ) {
        msg.message.reply( "Hmm something has gone wrong here..." );
        return false;
    }
    if ( !msg.message?.member?.permissions.has( "MANAGE_ROLES", true ) ) {
        msg.message.reply( "Your privilege has been checked and you have been deemed too pathetic to use this command." );
        return false;
    }
    if (
        !client?.guilds?.cache
            ?.get( guildId )
            ?.members.cache.get( userId )
            ?.permissions.has( "MANAGE_ROLES", true )
    ) {
        msg.message.reply( "This is rather embarassing but I do not have the power for this..." );
        return false;
    }
    return true;
};