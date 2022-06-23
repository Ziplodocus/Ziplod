
import { client } from '../ziplod.js';
import { ClientEvents } from 'discord.js';
import { getDirs } from '../utility/paths.js';

export enum EventWhen {
    "on" = "on",
    "once" = "once"
}

type CustomEventObj = {
    [eventKey in keyof ClientEvents]: Function;
} & {
    type: EventWhen;
};

export function establishEvents(): void {
    getDirs( './events' ).forEach( async ( dirname: string /* Also keyof ClientEvents */ ) => {
        const event: CustomEventObj = await import( `./${dirname}/${dirname}.js` );
        // @ts-ignore Can't figure out how to get typescript to recognise
        //that dirname will be a keyof ClientEvents and also accept that as
        // a valid value for .forEach
        client[event.type]( dirname, event[dirname] );
    } );
}

