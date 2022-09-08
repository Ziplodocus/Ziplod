import ExtendedMessage from "../../../../classes/ExtendedMessage.js";
import { zumborInit } from "../../../../gameplay/zumbor.js";

export default async (msg: ExtendedMessage) => {
  console.log("zumbor!");
  zumborInit(msg);
};