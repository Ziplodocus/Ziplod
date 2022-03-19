class Player {
    constructor(name, health, streak) {
      this["_name"] = name;
      this["_health"] = health;
      this["_streak"] = streak;
    }
    get name() { return this._name };
    get health() { return this._health };
    get streak() { return this._streak };
    changeName(namein) { this._name = namein };
    changeHealth(change) { this._health += change };
    streakStatus(no) { this._streak = no };
    incrementStreak() { this._streak += 1 };
    damage(n) { this._health -= n };
    heal(n) { this._health += n }
}

class Encounter {
    constructor(description, succeed, fail, difficulty) {
        this._description = description,
        this._succed = succeed,
        this._fail = fail,
        this._difficulty = difficulty
    }
    
}