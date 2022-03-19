import extendedMessage from "../../../classes/extendedMessage";

export type Command = {
	name: string,
	handler: ( msg: extendedMessage ) => extendedMessage;
};

export default async ( msg: extendedMessage ) => {
	try {
		const command = await import( `./definedCommands/${msg.command}` );
		command( msg );
		return true;
	} catch {
		return false;
	}
};
