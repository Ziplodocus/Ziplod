
npm install && npm run start and it's sorted.

A config.ts file under src/data must be created with the following content:
```
export const prefix: string = commandPrefix;
export const token: string = yourBotToken;
export const textToSpeechAuth: string = googleAPIKey;
export const langTags: string[] = arrayOfValidLangTagsForTTS;

export enum ThemeTro {
    in = 'in',
    out = 'out'
}

```

