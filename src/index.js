// ██████ Integrations ████████████████████████████████████████████████████████

// —— Environment variables
require('dotenv').config();
// —— A powerful library for interacting with the Discord API
const { Client, Intents, Collection, MessageEmbed } = require('discord.js');
// —— Glob Filepaths
const { glob } = require('glob');
// —— Includes channel resolver
const ResolveChannel = require('./Core/Resolvers/ChannelResolver');
// —— Includes config file
const { prefix, logsChannel, colors } = require('./config.json');

// ██████ Initialization ██████████████████████████████████████████████████████

if (!process.env.TOKEN || typeof process.env.TOKEN === 'undefined') {
	throw new Error('You must pass the token for the client...');
}

// —— Initialize discord.js client
const client = new Client({
	intents: [
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_INTEGRATIONS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_WEBHOOKS,
	],
	partials: [
		'CHANNEL',
		'GUILD_MEMBER',
		'GUILD_SCHEDULED_EVENT',
		'MESSAGE',
		'REACTION',
		'USER',
	],
	allowedMentions: {
		parse: ['users', 'roles', 'everyone'],
		repliedUser: true,
	},
});

// —— Set client prefix
client.prefix = prefix;
// —— Collection of all events
client.events = new Collection();
// —— Collection of mongodb models
client.models = new Collection();

// —— Collection of all aliases
client.aliases = new Collection();
// —— Collection of all commands
client.commands = new Collection();
// —— Collection of all cooldowns
client.cooldowns = new Collection();
// —— Collection of all categories
client.categories = new Collection();
// —— Collection of all subcommands
client.subcommands = new Collection();

// —— Clear the console 🧹
console.clear();

// —— Initialize all handlers
glob.sync(`${process.cwd()}/src/Core/Handlers/**/*.js`)
	.forEach(handler => require(handler)(client));

// —— Send uncaught exception error to error logs channel
process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception: ', error);

	const Response = new MessageEmbed()
		.setColor(colors.error)
		.setTitle('Uncaught Exception')
		.setDescription(`${error}`);

	return ResolveChannel(logsChannel.error).send({ embeds: [Response] });
});

// —— Send unhandled rejection error to error logs channel
process.on('unhandledRejection', (reason, promise) => {
	console.error('[FATAL] Possible Rejection at: ', promise, ' reason: ', reason.message);

	const Response = new MessageEmbed()
		.setColor(colors.error)
		.setTitle('Unhandled Promise Rejection')
		.addField('Promise', `${promise}`)
		.addField('Reason', `${reason.message}`);

	return ResolveChannel(logsChannel.error).send({ embeds: [Response] });
});

// —— Logs the client in, establishing a websocket connection to Discord
client.login(process.env.TOKEN);
