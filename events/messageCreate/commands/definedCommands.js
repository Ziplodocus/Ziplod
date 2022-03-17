import { playSound, delCommands } from "../../../helperFunctions/helpers.js";
import { MessageButton, MessageActionRow, GuildMemberRoleManager } from "discord.js";
import { client } from "../../../ziplod.js";
export function definedCommands(msg) {
    return {
        comedy() {
            if (!msg.voiceChannel)
                return msg.message.reply("\n Someone has to be in a voice channel don' they? idiot.");
            playSound(`./assets/sounds/seinfeld.mp3`, msg.voiceChannel);
            return msg;
        },
        smoothBrain() {
            msg.message.reply('Smoother than yours.');
            return msg;
        },
        obliterate() {
            if (msg.message.channel.type !== "GUILD_TEXT")
                return;
            const time = msg.voiceChannel ? 11000 : 0;
            delCommands(msg.message.channel, time);
            msg.voiceChannel &&
                playSound(`./assets/sounds/exodia.mp3`, msg.voiceChannel);
            return msg;
        },
        shush() {
            msg.message.reply("No, you shush you bum");
            return msg;
        },
        help() {
            const helpText = `Here is a list of current commands:\n!bazinga - plays a laugh\n!sad - plays a sad\n!shush - Tell the bot off\n!help - sends for the help\n!comedy - prepare yourself\n!meme - random meme attack, optionally @ your friends`;
            msg.message.channel.send(helpText);
            return msg;
        },
        async endRolers() {
            if (!checkValidity(msg))
                return;
            let argRole = msg.args.join(" ") || "Custom Gamer";
            let replyData = [];
            const roles = await msg.message.guild?.roles.fetch(undefined, { cache: true });
            const therole = roles?.find(role => role.name === argRole);
            if (therole) {
                const gamers = therole.members;
                gamers.forEach(gamer => {
                    replyData.push(gamer.user.tag);
                    gamer.roles.remove(therole);
                });
                msg.message.reply(replyData.join(",\n") +
                    "\n have had the role " +
                    argRole +
                    " successfully removed. Really, really. For real this time.");
            }
            else
                msg.message.reply("There is no " + argRole + " role :(");
            return msg;
        },
        async roleCall() {
            if (!checkValidity(msg))
                return;
            const argRole = msg.args.join(" ") || "Custom Gamer";
            const roles = await msg.message.guild?.roles.fetch(undefined, { cache: true });
            const therole = roles?.find(role => role.name === argRole);
            if (!therole)
                return msg.message.reply("You have to pick a role that exists dummy.");
            const button1 = new MessageButton({
                customId: argRole,
                label: argRole,
                style: "PRIMARY",
                emoji: "👺"
            });
            const row1 = new MessageActionRow({
                components: [button1]
            });
            const messageOptions = {
                content: "Click to aquire role",
                components: [row1]
            };
            const themessage = await msg.message.channel.send(messageOptions);
            const collector = themessage.createMessageComponentCollector({
                componentType: "BUTTON",
                time: 120000
            });
            collector.on("collect", async (i) => {
                if (!(i?.member?.roles instanceof GuildMemberRoleManager))
                    return;
                await i?.member?.roles?.add(therole);
                const dmchan = await i.user.createDM();
                dmchan.send("You have been assigned the role " +
                    therole.name +
                    " in the server " +
                    i?.guild?.name);
                return;
            });
            collector.on("end", collected => {
                button1.setDisabled();
                button1.setEmoji("✔️");
                row1.components = [button1];
                messageOptions.components = [row1];
                messageOptions.content =
                    "You can no longer aquire the role by these means";
                themessage.edit(messageOptions);
                return;
            });
            return;
        }
    }[msg.command];
}
function checkValidity(msg) {
    const guildId = msg.message.guild?.id;
    const userId = client?.user?.id;
    if (!guildId || !userId) {
        msg.message.reply("Hmm something has gone wrong here...");
        return false;
    }
    if (!msg.message?.member?.permissions.has("MANAGE_ROLES", true)) {
        msg.message.reply("Your privilege has been checked and you have been deemed too pathetic to use this command.");
        return false;
    }
    if (!client?.guilds?.cache
        ?.get(guildId)
        ?.members.cache.get(userId)
        ?.permissions.has("MANAGE_ROLES", true)) {
        msg.message.reply("This is rather embarassing but I do not have the power for this...");
        return false;
    }
    return true;
}
