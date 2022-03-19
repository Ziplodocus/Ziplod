import extendedMessage from "../../../../classes/extendedMessage";

export default async ( msg: extendedMessage ) => {
    const file = msg.message.attachments.first()?.url;
    if ( !file ) return console.log( 'No attached file found' );

    try {
        console.log( 'Reading the file! Fetching data...' );

        // fetch the file from the external URL
        const response = await fetch( file );

        // if there was an error send a message with the status
        if ( !response.ok ) {
            return console.log(
                'There was an error with fetching the file:',
                response.statusText,
            );
        }
        console.log( response );
    } catch ( error ) {
        console.log( error );
    }
}; 