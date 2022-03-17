import { client } from '../../ziplod.js';
import { EventWhen } from '../events.js';
export function ready() { console.log(`Ready! Logged in as ${client?.user?.tag}`); }
;
export const type = EventWhen.once;
