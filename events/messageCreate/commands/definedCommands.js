
import { playSound, delCommands } from '../../../helper_functions/helpers.js';
import { MessageButton, MessageActionRow } from 'discord.js';
import { client } from '../../../ziplod.js';

export const definedCommands = {
    comedy() {
        if (!message.voiceChannel) return message.reply('\n Someone has to be in a voice channel don\' they? idiot.');
        playSound(`./assets/sounds/seinfeld.mp3`, message.voiceChannel);
        return message;
    },
    obliterate() {
        const time = message.voiceChannel ? 11000 : 0;
        delCommands(message.channel, time);
        message.voiceChannel && playSound(`./assets/sounds/exodia.mp3`, message.voiceChannel);
        return message;
    },
    shush() {
        message.reply('No, you shush you bum');
        return message;
    },
    help() {
        const helpText = (
            `Here is a list of current commands:\n!bazinga - plays a laugh\n!sad - plays a sad\n!shush - Tell the bot off\n!help - sends for the help\n!comedy - prepare yourself\n!meme - random meme attack, optionally @ your friends`
        );
        message.channel.send(helpText);
        return message;
    },
    async endRolers() {
        const guildId = message.guild.id;
        const userId = client.user.id;
        if ( !message.member.permissions.has( 'MANAGE_ROLES', true ) ) return message.reply("Your priviledge has been checked, and you have been deemed too pathetic to use this command.");
        if ( !client.guilds.cache.get(guildId).members.cache.get(userId).permissions.has( 'MANAGE_ROLES', true ) ) return message.reply('This is rather embarassing but I do not have the power for this...');
        let argRole = message.args.join(' ') || 'Custom Gamer';
        let replyData = [];
        const roles = message.guild.roles || await roles.fetch(null, {cache:true});
        const therole = roles.cache.find( role => role.name === argRole ) ;
        if (therole) {
            const gamers = therole.members;
            gamers.forEach( gamer => {
                replyData.push(gamer.user.tag);
                gamer.roles.remove(therole);
            })
            message.reply(replyData.join(',\n')+'\n have had the role '+argRole+' successfully removed. Really, really. For real this time.');
        } else message.reply("There is no "+argRole+" role :(");
        return message;
    },
    async roleCall() {
        const guildId = message.guild.id;
        const userId = client.user.id;
        if ( !message.member.permissions.has( 'MANAGE_ROLES', true ) ) return message.reply("Your priviledge has been checked, and you have been deemed too pathetic to use this command.");
        if ( !client.guilds.cache.get(guildId).members.cache.get(userId).permissions.has( 'MANAGE_ROLES', true ) ) return message.reply('This is rather embarassing but I do not have the power for this...');
        const argRole = message.args.join(' ') || 'Custom Gamer';
        const roles = message.guild.roles || await roles.fetch(null, {cache:true});
        const therole = roles.cache.find( role => role.name === argRole );
        console.log(therole);
        if(!therole) return message.reply("You have to pick a role that exists dummy.");

        const button1 = new MessageButton({
            customId: argRole,
            label: argRole,
            style: 'PRIMARY',
            emoji: '👺'
        })
        const row1 = new MessageActionRow({
            components: [button1]
        })
        const messageOptions = {
            content: "Click to aquire role",
            components: [row1]
        }

        const themessage = await message.channel.send(messageOptions);
        const collector = themessage.createMessageComponentCollector( {componentType: 'BUTTON', time: 3000} );
        collector.on( 'collect', async i => {
            await i.member.roles.add(therole);
            const dmchan = await i.user.createDM();
            dmchan.send('You have been assigned the role '+therole.name+' in the server '+i.guild.name);
            return 'Success'
        } );
        collector.on('end', collected => {
            button1.disabled = true;
            button1.emoji ='✔️';
            row1.components = [button1];
            messageOptions.components = [row1];
            messageOptions.content = "You can no longer aquire the role by these means";
            themessage.edit(messageOptions);
            return 'Success'
        })
        return message;
    }
}