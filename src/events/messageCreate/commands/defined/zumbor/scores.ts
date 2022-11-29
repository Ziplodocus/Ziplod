import ExtendedMessage from "../../../../../classes/ExtendedMessage.js";
import { Player } from "../../../../../gameplay/classes/Player.js";
import { scoreboard } from "../../../../../gameplay/zumbor.js";


export default async function(message: ExtendedMessage) {
    const scores = await scoreboard.get();
    if (scores instanceof Error) return console.error(scores);
    console.log(scores);
    message.message.channel.send(
        scores
            .map((player, i) => `${i + 1}: ${player.name} - ${player.user}`).join('\n')
    );
}