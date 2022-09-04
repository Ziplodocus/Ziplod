import { PlayerEffect } from "./PlayerEffect";

export enum EncounterResult {
  SUCCESS = "success",
  FAIL = "fail",
}

export type EncounterOptionResult = {
  type: EncounterResult;
  title: string;
  text: string;
  effect: PlayerEffect;
  value: any;
};
