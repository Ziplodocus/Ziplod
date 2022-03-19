
You'll need typescript installed, and must compile to js, then running the index.js at root in node should launch the bot.

A config.ts file under src/data must be created with the following format:
```
export const prefix: string = commandPrefix;
export const token: string = yourBotToken;
```

