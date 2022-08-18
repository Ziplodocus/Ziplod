import ExtendedMessage from "../../../../classes/ExtendedMessage.js";
import {Storage} from "../../../../ziplod.js";


export default async ( msg: ExtendedMessage ) => {
    const obj = await Storage.checkThemeCount(msg.message.author.tag);
    msg.message.reply(`Your have ${obj.int} intro(s) and ${obj.out} outro(s)`);
    return msg;
};