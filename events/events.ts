
import { client } from '../ziplod.js';
import { ClientEvents } from 'discord.js';
import { getDirs } from '../helperFunctions/helpers.js';

export enum EventWhen {
    on = "on",
    once = "once"
}

export function establishEvents(): void {
    getDirs('./events').forEach( async (dirname:keyof ClientEvents) => {
        const event = await import(`./${dirname}/${dirname}.js`);
        client[event.type](dirname, event[dirname]);
    });
}

