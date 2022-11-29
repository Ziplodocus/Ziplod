import { streamToString, stringToStream } from "../../utility/other.js";
import { Files } from "../../ziplod.js";
import { PlayerData } from "@ziplodocus/zumbor-types";

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
        if (this.cache) return this.cache;
        const res = await Files.get(this.path);
        if (res instanceof Error) return res;
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

        if (scores.length < 5) {
            scores.push(player);
            this.update(scores);
            return true;
        }
        console.log('Score cache before update: ' + this.cache);

        // Insert the current player at the position in which it beats a player on the board
        // Then remove the last place player
        for (const [position, scoredPlayer] of scores.entries()) {
            if (score < scoredPlayer.score) continue;
            scores.splice(position, 0, player);
            console.log(scores.pop()?.name + ' is gone!');
            break;
        };

        const result = await this.update(scores);
        console.log('Score cache after update: ' + this.cache);
        return result;
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
