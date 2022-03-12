
import { client } from '../ziplod.js';
import { Client, ClientEvents } from 'discord.js';
import { getDirs } from '../helperFunctions/helpers.js';

export enum EventWhen {
    on = "on",
    once = "once"
}
type eventWhen = keyof Client;

export function establishEvents(): void {
    getDirs('./events').forEach(async (dirname: keyof ClientEvents) => {
        console.log(dirname);
        const event = await import(`./${dirname}/${dirname}.js`);
        console.log(event);
        client[event.type](dirname, event[dirname]);
    });
}

