import ExtendedMessage from "../../../../../classes/ExtendedMessage.js";
import { Player } from "../../../../../gameplay/classes/Player.js";
import { getChannelMessager } from "../../../../../gameplay/helpers.js";
import { scoreboard } from "../../../../../gameplay/zumbor.js";


export default async function(message: ExtendedMessage) {
    const positionColours = [
        0xECB939,
        0xB3CDE0,
        0xBE9B7B,
        0x854442,
        0x3F3138
    ]
    const scores = await scoreboard.get();
    if (scores instanceof Error) return console.error(scores);
    const send = getChannelMessager(message.message.channel);
    console.log(scores);
    if (scores.length === 0) return send('Scoreboard is empty!', 'Even you might be able to make the board if you play now...');
    message.message.channel.send({
        embeds: scores.map((player, i) => {
            return {
                color: positionColours[i],
                title: `${player.name}`,
                description: player.description,
                fields: Object.entries(player.stats).map(tuple => {
                    return {
                        name: tuple[0],
                        value: tuple[1].toString(),
                        inline: true
                    };
                })
            };
        })
    }

    );
}