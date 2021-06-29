const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
//const ytdl = require('ytdl-core');
const fs = require('fs');
console.log("Launching Ziplod...")

const pre = config.prefix;
const helpText = (
	`Here is a list of current commands:
	!bazinga - plays a laugh
	!sad - plays a sad
	!shush - Tell the bot off
	!help - sends for the help
	!comedy - prepare yourself
	!meme - random meme attack, optionally @ your friends`
);


//plays the audio from the path in the channel
function playThisSound(audioPath) {
	voiceChan.join().then(connection => {
		console.log(`Now playing... ${audioPath} in ${voiceChan.name}`)
		connection.play(audioPath).catch(err => console.log(err));
	}, reason => {
		console.log(reason)
	})
};

//Plays random track from the requested type in the voiceChannel
function playMeme(command, message) {
	let i = 0;
	while (fs.existsSync(`./${command}Tracks/${command}${i}.mp3`)) {i++};
	if (i === 0) {
		message.reply('\n That is not one of my many powerful commands tiny person');
		return false
	}
	const rndInt = Math.floor(Math.random()*i);
	const audioPath = `./${command}Tracks/${command}${rndInt}.mp3`;
	playThisSound(audioPath);
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
		console.log('@' + author);
		return author.voice.channel
	}
	else if(recipient.voice.channel) {
		console.log('@' + recipient.user.tag);
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
	while (fs.existsSync(`./dudeTracks/${dude}${themeType}${i}.mp3`)) {i++};
	if (i === 0) {
		console.log(`No ${themeType} music for ${dude}`);
		return false
	};
	const randThemeNo = Math.floor(Math.random()*i)
	const themePath = `./dudeTracks/${dude}${themeType}${randThemeNo}.mp3`;
	const voiceChan = state.channel;
	console.log(`Playing ${dude}'s intro music ${themePath}`);
	playThisSound(themePath);
};

client.once('ready', () => {console.log('Ready!')});

//Plays intro music when someone joins a voicechannel, and outro music when they leave.
client.on('voiceStateUpdate', (oldState, newState) => {
	if (newState.member.user.bot) {return};
	console.log(`Voice state of ${newState.member.user.tag} changed`);
	if (oldState.channel == undefined && newState.channel !== undefined) {
		playTheme(newState, "Intro")
	}
	else if (newState.channel == undefined && oldState.channel !== undefined) {
		playTheme(oldState, "Outro")
	}
});

client.on('message', message => {	
	//If message doesn't begin with the prefix or if the author of the message is the bot then ignore.
	if (!message.content.startsWith(pre) | message.author.bot) {return};
	
	//Splits message content into an array of arguments and defines command as the primary argument
	const args = message.content.substring(pre.length).split(' ');
	const command = args[0];
	
	//Declaring channels
	const textChannel = message.channel;
	const voiceChan = whichVoiceChan(message, args);
	if (!voiceChan) {return};
	
	//Switch between applicable commands
	switch(command) {
		case 'obliterate':
			playThisSound(`./sounds/exodia.mp3`);
			delCommands(11000,textChannel);
			break
		case 'comedy':
			playThisSound(`./sounds/seinfeld.mp3`);
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

client.login(config.token);
