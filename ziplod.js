const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
//const ytdl = require('ytdl-core');
const fs = require('fs');
console.log("Launching Ziplod...")

const pre = config.prefix;
const helpText = (`Here is a list of current commands:
!bazinga - plays a laugh
!sad - plays a sad
!shush - Tell the bot off
!help - sends for the help
!comedy - prepare yourself
!meme - random meme attack, optionally @ your friends`
)

//Redundant 
/*const dudeSounds = {
	"Zirpho#5819" : {intro: ["./dudeTracks/ZirphoIntro.mp3"], outro: ["./dudeTracks/ZirphoOutro.mp3"]},
	"206057143198154753" : {intro: ["./dudeTracks/DeecoIntro.mp3"], outro: ["./dudeTracks/DeecoOutro.mp3"]},
	"345662204756099073" : {intro: ["./dudeTracks/AsherIntro.mp3"], outro: ["./dudeTracks/AsherOutro.mp3"]},
	"205771975807860737" : {intro: ["./dudeTracks/MafuIntro.mp3"], outro: ["./dudeTracks/MafuOutro.mp3", "./dudeTracks/MafuOutro1.mp3"]},
	"270240517378277386" : {intro: ["./dudeTracks/TableIntro.mp3"], outro: [""]},
	"162299432531001344" : {intro: ["./dudeTracks/ShenfieldIntro.mp3"], outro: [""]},
	"345664646549733388" : {intro: ["./dudeTracks/PlumbobIntro.mp3"], outro: ["./dudeTracks/PlumbobOutro.mp3"]},
	"279675717451644929" : {intro: ["./dudeTracks/KratosIntro.mp3"], outro: [""]}
}*/

//plays the audio from the path in the channel
function playThisSound(audioPath, voiceChan) {
	voiceChan.join()
	.then(connection => {
		console.log(`Now playing... ${audioPath} in ${voiceChan.name}`)
		const dispatcher = connection.play(audioPath);
	}, reason => {
		console.log(reason)
	})
};

//Plays random track from the requested type in the voiceChannel
function playRequest(audioType, voiceChan) {
	let i = 0;
	while (fs.existsSync(`./${audioType}Tracks/${audioType}${i}.mp3`)) {i++};
	if (i === 0) {
		message.reply('\n That is not one of my many powerful commands tiny person');
		return false
	}
	const rndInt = Math.floor(Math.random()*i);
	const audioPath = `./${audioType}Tracks/${audioType}${rndInt}.mp3`;
	playThisSound(audioPath, voiceChan);
};

function delCommands(time, textChannel) {
	textChannel
	.messages
	.fetch({limit:35})
	.then(messages => {
		messages
		.filter(message => message.content.startsWith(pre))
		.each(message => message.delete({timeout : time}))
	});
};

//Returns the voice channel determined by the sent message
function whichVoiceChan(msg, msgContent) {
	if(!msgContent[1]) {return msg.member.voice.channel}
	else if(msg.mentions.members.first()) {
		if(msg.mentions.members.first().voice.channel) {
			const recipient = msg.mentions.members.first();
			console.log(recipient.user.tag);
			return recipient.voice.channel;
		}
		else {
			console.log(msg.mentions.members.first().user.tag);
			msg.reply('You have to @ a user in a voice channel in this server, duh.');
			return false
		}
	}
	else {
		msg.reply(`There can only be 1 additional parameter and it must be a mention, idiot.`);
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
	playThisSound(themePath, voiceChan);
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
	else {return};
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
			playThisSound(`./sounds/exodia.mp3`, voiceChan);
			delCommands(11000,textChannel);
			break
		case 'comedy':
			playThisSound(`./sounds/seinfeld.mp3`, voiceChan);
			break
		case 'shush':
			if (voiceChan) {voiceChan.leave();}
			else {message.reply('No, you shush you bum');}
			break
		case 'help':
			textChannel.send(helpText);
			break
		default :
			playRequest(command, voiceChan);
			break
	}
});

client.login(config.token);
