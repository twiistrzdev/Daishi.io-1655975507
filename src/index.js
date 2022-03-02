// ██████ Integrations ████████████████████████████████████████████████████████

// —— Environment variables
require('dotenv').config();
// —— A powerful library for interacting with the Discord API
const { Client, Intents, Collection } = require('discord.js');
// —— Glob Filepaths
const { glob } = require('glob');
// —— Config file
const { prefix } = require('./config.json');

// ██████ Initialization ██████████████████████████████████████████████████████

process.on('rejectionHandled', (error) => console.error(error));
process.on('unhandledRejection', (error) => console.error(error));
process.on('uncaughtException', (error) => console.error(error));

if (!process.env.TOKEN) throw new Error('You must pass the token for the client...');

// —— Initialize discord.js client
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
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
		parse: ['users', 'roles'],
		repliedUser: true,
	},
});

client.prefix = prefix;
// —— Collection of all events
client.events = new Collection();
// —— Collection of all commands
client.commands = new Collection();
// —— Collection of all command aliases
client.commandsAliases = new Collection();
// —— Collection of member fetched by guild, boolean
client.isMembersFetchedByGuild = new Collection();

// —— Clear the console 🧹
console.clear();

// —— Initialize all handlers
glob.sync(`${process.cwd()}/src/Handlers/**/*.js`)
	.forEach(handler => require(handler)(client));

// —— Logs the client in, establishing a websocket connection to Discord
client.login(process.env.TOKEN);
