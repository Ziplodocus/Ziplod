import ExtendedMessage from '../../../../../classes/ExtendedMessage.js';
import { getChannelMessager } from '../../../../../gameplay/helpers.js';
import { encounters } from '../../../../../gameplay/zumbor.js';

export default async function(message : ExtendedMessage) {
    const res = await encounters.updateCache();
    const niceMessage = getChannelMessager(message.message.channel);
    niceMessage('Update Complete','Encounters refreshed!');
}