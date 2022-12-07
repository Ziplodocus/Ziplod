import ExtendedMessage from "../../../../classes/ExtendedMessage.js";
import { zumborInit } from "../../../../gameplay/zumbor.js";

export default async (msg: ExtendedMessage) => {
  zumborInit(msg);
};
