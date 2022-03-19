import { client } from '../../ziplod';
import { EventWhen } from '../events';

export function ready() { console.log( `Ready! Logged in as ${client?.user?.tag}` ); };
export const type = EventWhen.once;