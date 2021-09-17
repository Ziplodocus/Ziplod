const { Client, Intents } = require('discord.js');
const { prefix, token } = require('./config.json');
const v = require('@discordjs/voice');
const intents = {
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES
	]
}
const client = new Client( intents );
//const ytdl = require('ytdl-core');
const { existsSync } = require('fs');
console.log("Launching Ziplod...")

const pre = prefix;
const helpText = (
	`Here is a list of current commands:
	!bazinga - plays a laugh
	!sad - plays a sad
	!shush - Tell the bot off
	!help - sends for the help
	!comedy - prepare yourself
	!meme - random meme attack, optionally @ your friends`
);


//////////////////////////
//      FUNCTIONS      //
/////////////////////////

//plays the audio from the path in the channel
function playThisSound(audioPath, channel) {
	const connection = v.joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
	})
	const player = v.createAudioPlayer();
	const resource = v.createAudioResource(audioPath);
	player.play(resource);
	connection.subscribe(player);
	console.log(`Now playing... ${audioPath} in ${channel.name}`)
};

//Plays random track from the requested type in the voiceChannel
function playMeme(command, message) {
	let i = 0;
	while (existsSync(`./${command}Tracks/${command}${i}.mp3`)) {i++};
	if (i === 0) {
		message.reply('\n That is not one of my many powerful commands tiny person');
		return false
	}
	const rndInt = Math.floor(Math.random()*i);
	const audioPath = `./${command}Tracks/${command}${rndInt}.mp3`;
	const voiceChan = whichVoiceChan(message);
	playThisSound(audioPath, voiceChan);
};

function delCommands(time) {
	textChannel.messages
		.fetch({limit:35})
		.then(messages => {
			messages
				.filter(message => message.content.startsWith(pre))
				.each(message => message.delete({timeout : time}))
		});
};

//Returns the voice channel determined by the sent message
function whichVoiceChan(msg) {
	const recipient = msg.mentions.members.first();
	const author = msg.member;

	if(!recipient) {
		console.log(author.user.tag);
		return author.voice.channel
	}
	else if(recipient.voice.channel) {
		console.log(recipient.user.tag);
		return recipient.voice.channel;
	}
	else if (recipient) {
		msg.reply('You have to @ a user in a voice channel in this server, duh.');
		return false
	}
};

//Plays intro and outro music
function playTheme(state, themeType) {
	const dude = state.member.user.tag;
	let i = 0;
	while (existsSync(`./dudeTracks/${dude}/${themeType}-${i}.mp3`)) {i++};
	if (i === 0) {
		console.log(`No ${themeType} music for ${dude}`);
		return false
	};
	const randThemeNo = Math.floor(Math.random()*i)
	const themePath = `./dudeTracks/${dude}/${themeType}-${randThemeNo}.mp3`;
	const voiceChan = state.channel;
	console.log(`Playing ${dude}'s intro music ${themePath}`);
	playThisSound(themePath, voiceChan);
};


//////////////////////////
//    EVENT HANLDERS   //
/////////////////////////
client.once('ready', () => {console.log('Ready! Steady! ...')});

//Plays intro music when someone joins a voicechannel, and outro music when they leave.
client.on('voiceStateUpdate', (oldState, newState) => {
	if (newState.member.user.bot) {return};
	console.log(`Voice state of ${newState.member.user.tag} changed`);
	if (oldState.channel == undefined && newState.channel !== undefined) {
		playTheme(newState, "int")
	}
	else if (newState.channel == undefined && oldState.channel !== undefined) {
		playTheme(oldState, "out")
	}
});

client.on('messageCreate', message => {	
	//If message doesn't begin with the prefix or if the author of the message is the bot then ignore.
	if (!message.content.startsWith(pre) | message.author.bot) {return};
	
	//Splits message content into an array of arguments and defines command as the primary argument
	const args = message.content.substring(pre.length).split(' ');
	const command = args[0];
	
	//Declaring channels
	const textChannel = message.channel;
	const voiceChan = whichVoiceChan(message);
	if (!voiceChan) {return};
	
	//Switch between applicable commands
	switch(command) {
		case 'obliterate':
			playThisSound(`./sounds/exodia.mp3`, voiceChan);
			delCommands(11000,textChannel);
			break
		case 'comedy':
			playThisSound(`./sounds/seinfeld.mp3`, voiceChan);
			break
		case 'shush':
			if (client.voice.channel) {client.voice.channel.leave();}
			else {message.reply('No, you shush you bum');}
			break
		case 'help':
			textChannel.send(helpText);
			break
		default :
			playMeme(command, message);
			break
	}
});

client.login(token);
