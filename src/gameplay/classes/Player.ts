export class Player {
  name: string;
  health: number;
  score: number;

  constructor(name: string, health: number, score: number) {
    this.name = name;
    this.health = health;
    this.score = score;
  }
  damage(n = 1) {
    this.health -= n;
  }
  heal(n = 1) {
    this.health += n;
  }
}
