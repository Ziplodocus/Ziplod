import { client } from '../ziplod.js';
import { getDirs } from '../helperFunctions/helpers.js';
export var EventWhen;
(function (EventWhen) {
    EventWhen["on"] = "on";
    EventWhen["once"] = "once";
})(EventWhen || (EventWhen = {}));
export function establishEvents() {
    getDirs('./events').forEach(async (dirname) => {
        const event = await import(`./${dirname}/${dirname}.js`);
        client[event.type](dirname, event[dirname]);
    });
}
