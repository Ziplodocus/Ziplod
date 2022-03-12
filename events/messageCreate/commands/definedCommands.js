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
            var _a;
            if (!checkValidity(msg))
                return;
            let argRole = msg.args.join(" ") || "Custom Gamer";
            let replyData = [];
            const roles = await ((_a = msg.message.guild) === null || _a === void 0 ? void 0 : _a.roles.fetch(undefined, { cache: true }));
            const therole = roles === null || roles === void 0 ? void 0 : roles.find(role => role.name === argRole);
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
            var _a;
            if (!checkValidity(msg))
                return;
            const argRole = msg.args.join(" ") || "Custom Gamer";
            const roles = await ((_a = msg.message.guild) === null || _a === void 0 ? void 0 : _a.roles.fetch(undefined, { cache: true }));
            const therole = roles === null || roles === void 0 ? void 0 : roles.find(role => role.name === argRole);
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
                time: 3000
            });
            collector.on("collect", async (i) => {
                var _a, _b, _c, _d;
                if (!(((_a = i === null || i === void 0 ? void 0 : i.member) === null || _a === void 0 ? void 0 : _a.roles) instanceof GuildMemberRoleManager))
                    return;
                await ((_c = (_b = i === null || i === void 0 ? void 0 : i.member) === null || _b === void 0 ? void 0 : _b.roles) === null || _c === void 0 ? void 0 : _c.add(therole));
                const dmchan = await i.user.createDM();
                dmchan.send("You have been assigned the role " +
                    therole.name +
                    " in the server " +
                    ((_d = i === null || i === void 0 ? void 0 : i.guild) === null || _d === void 0 ? void 0 : _d.name));
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
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const guildId = (_a = msg.message.guild) === null || _a === void 0 ? void 0 : _a.id;
    const userId = (_b = client === null || client === void 0 ? void 0 : client.user) === null || _b === void 0 ? void 0 : _b.id;
    if (!guildId || !userId) {
        msg.message.reply("Hmm something has gone wrong here...");
        return false;
    }
    if (!((_d = (_c = msg.message) === null || _c === void 0 ? void 0 : _c.member) === null || _d === void 0 ? void 0 : _d.permissions.has("MANAGE_ROLES", true))) {
        msg.message.reply("Your privilege has been checked and you have been deemed too pathetic to use this command.");
        return false;
    }
    if (!((_h = (_g = (_f = (_e = client === null || client === void 0 ? void 0 : client.guilds) === null || _e === void 0 ? void 0 : _e.cache) === null || _f === void 0 ? void 0 : _f.get(guildId)) === null || _g === void 0 ? void 0 : _g.members.cache.get(userId)) === null || _h === void 0 ? void 0 : _h.permissions.has("MANAGE_ROLES", true))) {
        msg.message.reply("This is rather embarassing but I do not have the power for this...");
        return false;
    }
    return false;
}
