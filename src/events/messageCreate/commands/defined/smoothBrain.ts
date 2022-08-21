import ExtendedMessage from "../../../../classes/ExtendedMessage.js";

export default async function (msg: ExtendedMessage) {
  msg.respond("Smoother than yours.");
  return msg;
}
