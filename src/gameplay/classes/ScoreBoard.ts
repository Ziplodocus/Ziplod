import { streamToString, stringToStream } from "../../utility/other.js";
import { Files } from "../../ziplod.js";
import { PlayerData } from "@ziplodocus/zumbor-types";
import { Error404 } from "../../classes/Errors.js";

export class ScoreBoard {
    path: string;
    cache: PlayerData[] | undefined;
    constructor() {
        this.path = `zumbor/scoreboard.json`;
        this.get().then(scores => this.cache = !(scores instanceof Error) ? scores : undefined);
    }
    /*
    Retrieves the scoreboard file and caches it in memory
    */
    async get(): Promise<PlayerData[] | Error> {
        const res = await Files.get(this.path);
        if (res instanceof Error404) {
            await Files.add(this.path, stringToStream('[]'));
            return [];
        }
        else if (res instanceof Error) return res;
        const json = await streamToString(res);
        const scoreboard = JSON.parse(json);
        if (!Array.isArray(scoreboard)) return new Error('Fetched scoreboard is not an array!');
        this.cache = scoreboard;
        return scoreboard;
    }

    /*
    Asssigns the current player to the leaderboard if they have beaten a score
    Returns true for success and false for no ranking
    */
    async set(player: PlayerData): Promise<boolean | Error> {
        const score = player.score;

        const scores = await this.get();
        if (scores instanceof Error) return scores;

        if (scores.length === 0) {
            scores.push(player);
            this.update(scores);
            return true;
        }
        console.log('Score cache before update: ');
        console.log(this.cache);

        let didWin = false;
        // Insert the current player at the position in which it beats a player on the board
        // Then remove the last place player
        for (const [position, scoredPlayer] of scores.entries()) {
            console.log(position, scoredPlayer);
            if (score < scoredPlayer.score) continue;
            didWin = true;
            console.log(player.name + ' beats ' + scoredPlayer.name + ' with ' + player.score + ' vs ' + scoredPlayer.score);
            scores.splice(position, 0, player);
            console.log(scores.pop()?.name + ' is gone!');
            break;
        };
        console.log('Scores to be uploaded');
        console.log(scores);
        const result = await this.update(scores);
        if (result instanceof Error) return result;
        console.log('Score cache after update: ');
        console.log(this.cache);
        return didWin;
    }

    /*
    Update the scoreboard file with a new scoreboard
    */
    private async update(data: PlayerData[]) {
        const str = JSON.stringify(data);
        return Files.update(
            this.path,
            stringToStream(str),
        );
    }

    async doesRank(usertag: string) {
        const scores = await this.get();
        if (scores instanceof Error) return scores;
        const userWins = scores.filter(scored => scored.user === usertag);
        return userWins || false;
    }
}
