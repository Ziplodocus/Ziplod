import { ColorResolvable } from "discord.js";
import { EncounterOption } from "./EncounterOption.js";

export type EncounterData = {
  title: string;
  text: string;
  color?: ColorResolvable;
  options: { [label: string]: EncounterOption };
};
