type EncounterData = {
  messages: {
    start: string;
    success: string;
    failure: string;
  };
  difficulty: number;
};

export class Encounter {
  // static onStart: string;
  // static onSucceed: () => {};
  // static onFail: () => {};
  messages: EncounterData["messages"];
  difficulty: EncounterData["difficulty"];
  constructor(encounter: EncounterData) {
    this.messages = encounter.messages;
    this.difficulty = encounter.difficulty;
  }
}
