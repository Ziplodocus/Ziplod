import ExtendedMessage from "../../../../classes/ExtendedMessage.js";

export default async (msg: ExtendedMessage) => {
  msg.respond("No, you shush you bum");
  return msg;
};
