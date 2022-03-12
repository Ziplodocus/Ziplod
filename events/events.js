import { client } from '../ziplod.js';
import { getDirs } from '../helperFunctions/helpers.js';
export var EventWhen;
(function (EventWhen) {
    EventWhen["on"] = "on";
    EventWhen["once"] = "once";
})(EventWhen || (EventWhen = {}));
export function establishEvents() {
    getDirs('./events').forEach(async (dirname /* Also keyof ClientEvents */) => {
        const event = await import(`./${dirname}/${dirname}.js`);
        // @ts-ignore Can't figure out how to get typescript to recognise
        //that dirname will be a keyof ClientEvents and also accept that as
        // a valid value for .forEach
        client[event.type](dirname, event[dirname]);
    });
}
