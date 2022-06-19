import extendedMessage from "../../../classes/extendedMessage.js";

export type Command = {
	name: string,
	handler: ( msg: extendedMessage ) => extendedMessage;
};

export default async ( msg: extendedMessage ) => {
	try {
		const { default: command } = await import( `./definedCommands/${msg.command}.js` );
		console.log(command);
		command( msg );
		return true;
	} catch ( err ) {
		return false;
	}
};
