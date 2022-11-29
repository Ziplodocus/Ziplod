import { streamToString, stringToStream } from "../../utility/other.js";
import { Files } from "../../ziplod.js";
import { PlayerData } from "../types/index.js";

export class ScoreBoard {
    path: string;
    cache: PlayerData[] | undefined;
    constructor() {
        this.path = `zumbor/scoreboard.json`;
        this.scores().then(scores => this.cache = !(scores instanceof Error) ? scores : undefined);
    }
    /*
    Retrieves the scoreboard file and caches it in memory
    */
    async scores(): Promise<PlayerData[] | Error> {
        if (this.cache) return this.cache;
        const res = await Files.get(this.path);
        if (res instanceof Error) return res;
        const json = await streamToString(res);
        console.log(json);
        const scoreboard = JSON.parse(json);
        this.cache = scoreboard;
        return scoreboard;
    }

    /*
    Asssigns the current player to the leaderboard if they have beaten a score
    Returns true for success and false for no ranking
    */
    async set(player: PlayerData): Promise<boolean | Error> {
        const score = player.score;

        const scoreBoard = await this.scores();
        if (scoreBoard instanceof Error) return scoreBoard;

        let lowestI: number | false = false;
        scoreBoard.forEach((scoredPlayer, i) => {
            lowestI = (score > scoredPlayer.score) ? i : lowestI;
        });

        if (!lowestI) return false;

        // Does this alter the cache?
        // If not add cache update in the update function
        console.log(this.cache);
        scoreBoard[lowestI] = player;
        console.log(this.cache);

        return this.update(scoreBoard);
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
        const scores = await this.scores();
        if (scores instanceof Error) return scores;
        const userWins = scores.filter(scored => scored.user === usertag);
        return userWins || false;
    }
}
