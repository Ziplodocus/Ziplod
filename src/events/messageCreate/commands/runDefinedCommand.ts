import ExtendedMessage from "../../../classes/ExtendedMessage.js";

export type Command = {
	name: string,
	handler: ( msg: ExtendedMessage ) => ExtendedMessage;
};

export default async ( msg: ExtendedMessage ) => {
	try {
		const { default: command } = await import( `./definedCommands/${msg.command}.js` );
		command( msg );
		return true;
	} catch ( err ) {
		return false;
	}
};
