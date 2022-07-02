import { GuildMemberRoleManager, MessageActionRow, MessageButton } from "discord.js";
import ExtendedMessage from "../../../../classes/ExtendedMessage.js";
import checkPermissions from "../../../../utility/checkPermissions.js";

export default async ( msg: ExtendedMessage ) => {
    if ( !checkPermissions( msg ) ) return;
    const argRole = msg.args.join( " " ) || "Custom Gamer";
    const roles = await msg.message.guild?.roles.fetch( undefined, { cache: true } );
    const therole = roles?.find( role => role.name === argRole );
    if ( !therole )
        return msg.message.reply( "You have to pick a role that exists dummy." );

    const button1 = new MessageButton( {
        customId: argRole,
        label: argRole,
        style: "PRIMARY",
        emoji: "👺"
    } );
    const row1 = new MessageActionRow( {
        components: [button1]
    } );
    const messageOptions = {
        content: "Click to aquire role",
        components: [row1]
    };

    const themessage = await msg.message.channel.send( messageOptions );
    const collector = themessage.createMessageComponentCollector( {
        componentType: "BUTTON",
        time: 120000
    } );
    collector.on( "collect", async i => {
        if ( !( i?.member?.roles instanceof GuildMemberRoleManager ) ) return;
        await i?.member?.roles?.add( therole );
        const dmchan = await i.user.createDM();
        dmchan.send(
            "You have been assigned the role " +
            therole.name +
            " in the server " +
            i?.guild?.name
        );
        return;
    } );
    collector.on( "end", collected => {
        button1.setDisabled();
        button1.setEmoji( "✔️" );
        row1.components = [button1];
        messageOptions.components = [row1];
        messageOptions.content =
            "You can no longer aquire the role by these means";
        themessage.edit( messageOptions );
        return;
    } );
    return;
};