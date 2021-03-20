const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
//const ytdl = require('ytdl-core');
const { OpusEncoder } = require('@discordjs/opus');
const fs = require('fs');
console.log("Launching Bazinga...")

// Create the encoder.
// Specify 48kHz sampling rate and 2 channel size.
const encoder = new OpusEncoder(48000, 2);
// Encode and decode.
//const encoded = encoder.encode( 48000 / 100);
//const decoded = encoder.decode( 48000 / 100);

const pre = config.prefix;
const helpText = '\n Here is a list of current commands: \n !bazinga - plays a laugh \n !sad - plays a sad \n !shush - Tell the bot off \n !fail - crashes the bot \n !help - sends for the help \n !comedy - prepare yourself \n !meme - random meme attack, optionally @ your friends \n !dbd - Sacrifice'
//const stream = ytdl('https://www.youtube.com/watch?v=H47ow4_Cmk0&ab_channel=UsaSatsui',{filter: 'audioonly'});

const dudeSounds = {
	"193531624422375424" : {join: "./dudeTracks/Zirpho.mp3", leave: ["./dudeTracks/ZirphoLeave.mp3"]},
	"206057143198154753" : {join: "./dudeTracks/Deeco.mp3", leave: ["./dudeTracks/DeecoLeave.mp3"]},
	"345662204756099073" : {join: "./dudeTracks/Asher.mp3", leave: ["./dudeTracks/AsherLeave.mp3"]},
	"205771975807860737" : {join: "./dudeTracks/Mafu.mp3", leave: ["./dudeTracks/MafuLeave.mp3", "./dudeTracks/MafuLeave1.mp3"]},
	"270240517378277386" : {join: "./dudeTracks/Table.mp3", leave: [""]},
	"162299432531001344" : {join: "./dudeTracks/Shenfield.mp3", leave: [""]},
	"345664646549733388" : {join: "./dudeTracks/Plumbob.mp3", leave: ["./dudeTracks/PlumbobLeave.mp3"]},
	"279675717451644929" : {join: "./dudeTracks/Kratos.mp3", leave: [""]}
}

function paramNo(param) {
	i = 0;
	while (fs.existsSync(`./${param}Tracks/${param}${i}.mp3`)) {i++};
	return i
};

function randomNo(audio) {return Math.floor(Math.random()*paramNo(audio))};

function playSound(path, voiceChannel) {
	voiceChannel.join().then(connection => {
		let dispatcher = connection.play(path);
		dispatcher.on('end', end => {voiceChannel.leave()});
	})
	.catch('end',err => console.log(err));
}

function delCommands(time,textChannel) {
	textChannel
		.messages
		.fetch({limit:35})
		.then(messages => {
			messages
				.filter(message => message.content.startsWith('!'))
				.each(message => message.delete({timeout : time}))
			;
		});
	;
};

client.once('ready', () => {console.log('Ready!')});


client.on('voiceStateUpdate', (oldState, newState) => {
	//if (client.voice.)
	console.log(`Voice state of ${newState.member.user.username} changed`);
	let dude;
	let soundPath;
	let voiceChannel;
	if (oldState.channel == undefined && newState.channel !== undefined) {
		dude = newState.id;
		if(!dudeSounds[dude]) {return};
		console.log(`Playing ${newState.member.user.username}'s intro music ${dudeSounds[dude].join}`);
		soundPath = dudeSounds[dude].join;
		voiceChannel = newState.channel;
		playSound(soundPath, voiceChannel);
	}
	else if (newState.channel == undefined && oldState.channel !== undefined) {
		dude = oldState.id;
		if(!dudeSounds[dude]) {return}
		console.log(`Playing ${oldState.member.user.username}'s outro music ${dudeSounds[dude].leave}`);
		let leaveSounds = dudeSounds[dude].leave;
		soundPath = leaveSounds[Math.floor(Math.random()*leaveSounds.length)];
		voiceChannel = oldState.channel;
		playSound(soundPath, voiceChannel);
	}
	else {return};
});

client.on('message', message => {	
	//If message doesn't begin with '!' or the author of the message is the bot then ignore.
	if (!message.content.startsWith("!") | message.author.bot) {return};
	
	//Splits message content into an array of arguments
	const args = message.content.substring(pre.length).split(' ');
	
	//Declaring variables that differ based on message content
	let voiceChannel;
	let random;
	let textChannel = message.channel;
	
	
	//Uses the @'d user's voicechannel. else the message author's
	if (args[1]) {	
		if(message.mentions.members.first().voice.channel) {
			let member = message.mentions.members.first();
			console.log(member);
			voiceChannel = member.voice.channel;
		}
		else if (message.mentions.members) {
			console.log(message.mentions.members.first());
			message.reply('You have to @ a user in this server duh. They also have to be in a voice channel.');
			return
		}
		else {
			message.reply('Try again dufus')
			return
		}
	}
	else {
		voiceChannel = message.member.voice.channel;
	}
	
	if (!voiceChannel) {
		message.reply('You have to be in a voice chanel for that, dumb dumb')
	};
	
	switch(args[0]){
		case 'dbd':
			random = randomNo("dbd")
			console.log("Playing dbd" + random)
			playSound(`./DbDTracks/dbd${random}.mp3`,voiceChannel)
			break
		case 'bazinga':
			random = randomNo("bazinga")
			console.log("Playing bazinga" + random);
			playSound(`./bazingaTracks/bazinga${random}.mp3`,voiceChannel);
			break;
		case 'sad':
			random = randomNo("sad")
			console.log("Playing sad" + random);
			playSound(`./sadTracks/sad${random}.mp3`,voiceChannel);
			break
		case 'meme' :
			random = randomNo("meme")
			console.log("Playing meme" + random);
			playSound(`./memeTracks/meme${random}.mp3`,voiceChannel);
			break
		case 'obliterate':
			playSound(`./sounds/exodia.mp3`,voiceChannel);
			delCommands(11000,textChannel);
			break
		case 'comedy':
			playSound(`./sounds/seinfeld.mp3`,voiceChannel);
			break
		case 'shush':
			if (voiceChannel) {
				voiceChannel.leave();
			}
			else {
				message.reply('No, you shush you bum');
			}
			break
		case 'fail':
			throw 'Intentional Error'
		case 'help':
			textChannel.send(
			`Here is a list of current commands:
			!bazinga - plays a laugh
			!sad - plays a sad
			!shush - Tell the bot off
			!fail - crashes the bot
			!help - sends for the help
			!comedy - prepare yourself
			!meme - random meme attack, optionally @ your friends`
			);
			break
		default :
			message.reply('\n That is not one of my many powerful commands tiny person');
			break
	}
});

client.login(config.token);
