
import { ready } from './ready.js';
import { messageCreate } from './messageCreate.js';
import { voiceStateUpdate } from './voiceStateUpdate.js';
import { client } from '../ziplod.js';

const events = [
    ready,
    messageCreate,
    voiceStateUpdate
]

// Adding event listeners
export async function setupEventListeners() { 
    events.forEach( event => client[event.how]( event.name, event.execute ) ) 
}