You must aquire a Google cloud service account json key and add an environment
variable named GOOGLE_APPLICATION_CREDENTIALS set as the path to the key.

If you do not wish to use Google Cloud storage, refactoring the FileManager
class' methods to interact with whatever storage systme you wish may also work
as intended. I have not tested this however.

A config.ts file under src/data must be created with the following content:

```
// The prefix to messages to trigger the bots commands
export const prefix: string = commandPrefix;

// The Discord Bots token
export const token: string = yourBotToken;

// Google text to speech api key
export const ttsAuth: string = googleAPIKey;

// Valid language codes for the Google Text to Speech api
// There is a utility function getTTSLanguageCodes, which will write a list of all valid codes to a file langCodes.txt
export const langTags: string[] = arrayOfValidLangTagsForTTS;
```
