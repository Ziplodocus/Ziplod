import { client } from '../../ziplod.js';
import { EventWhen } from '../events.js';
export function ready() { var _a; console.log(`Ready! Logged in as ${(_a = client === null || client === void 0 ? void 0 : client.user) === null || _a === void 0 ? void 0 : _a.tag}`); }
;
export const type = EventWhen.once;
