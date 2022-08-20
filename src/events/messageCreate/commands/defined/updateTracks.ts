import ExtendedMessage from "../../../../classes/ExtendedMessage.js";
import { Tracks } from "../../../../ziplod.js";

export default async (msg: ExtendedMessage) => {
  Tracks.updateCount();
  return msg;
};
