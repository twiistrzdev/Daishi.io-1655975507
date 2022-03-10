// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, MessageEmbed } = require('discord.js');
// —— A MongoDB object modeling tool designed to work in an asynchronous environment
const mongoose = require('mongoose');
// —— Includes channel resolver
const ResolveChannel = require('../Core/Resolvers/ChannelResolver');
// —— Includes config file
const { enableStatusLogging, presence, logsChannel, colors, whitelist } = require('../config.json');

// ██████ | ███████████████████████████████████████████████████████████████████

module.exports = {
	name: 'ready',
	once: true,

	/**
     *
     * @param {Client} client
     */
	async callback(client) {
		// —— Fetch client application information
		await client.application.fetch();

		// —— Fetch all guilds
		await client.guilds.fetch();

		client.guilds.cache.map(async (guild) => {
			// —— Fetch all guild roles
			await guild.roles.fetch();
			// —— Fetch all guild emojis
			await guild.emojis.fetch();
			// —— Fetch all guild members
			await guild.members.fetch();
			// —— Fetch all guild channels
			await guild.channels.fetch();
		});

		// —— Initialize MongoDB
		if (process.env.MONGODB) {
			console.log('\nConnecting to the MongoDB server, please wait...');

			await mongoose
				.connect(process.env.MONGODB, {
					keepAlive: true,
					useNewUrlParser: true,
					useUnifiedTopology: true,
				})
				.then(() => {
					client.database = mongoose.connection.models;
					console.log(`${client.user.tag} is now connected to the MongoDB.`);
				})
				.catch(error => {
					console.log(error);
				});
		}
		else {
			console.log('\nNo MongoDB credentials found. All models will not be usable.');
		}

		// —— Set client user presence
		client.user.setPresence({
			activities: [
				{
					name: (presence.activity.name).replace('{{prefix}}', client.prefix),
					type: presence.activity.type,
					url: presence.activity.url || null,
				},
			],
			status: presence.status,
		});

		console.log(`${client.user.tag} initialized —— Node ${process.version}.`);

		if (enableStatusLogging && typeof enableStatusLogging === 'boolean') {
			const Response = new MessageEmbed();

			Response.setColor(colors.primary);
			Response.setTitle('Client Initialized');
			Response.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 512 }));

			Response.setDescription(
				'Daishi.io - Discord Bot\n' +
				'Powerful multipurpose discord bot packed with features.\n',
			);

			Response.addField('Servers', `${client.guilds.cache.size}`, true);
			Response.addField('Channels', `${client.channels.cache.size}`, true);
			Response.addField('Users', `${client.users.cache.size}`, true);

			Response.addField('Commands', `${client.commands.size}`, true);
			Response.addField('Events', `${client.events.size}`, true);
			Response.addField('Models', `${client.models.size}`, true);

			Response.addField('Node', `${process.version}`, true);
			Response.addField('MongoDB', `${mongodbState(mongoose.connection.readyState)}`, true);
			Response.addField('Ping', `${client.ws.ping}`, true);

			const whitelistedGuilds = [];
			const whitelistedUsers = [];
			whitelist.guilds.forEach(g => whitelistedGuilds.push(`${g}`));
			whitelist.users.forEach(u => whitelistedUsers.push(`<@${u}>`));

			Response.addField('Whitelisted Guilds', `${whitelistedGuilds.join('\n')}`, true);
			Response.addField('Whitelisted Users', `${whitelistedUsers.join('\n')}`, true);

			Response.setTimestamp();

			await ResolveChannel(client, logsChannel.status).send({ embeds: [Response] });
		}
	},
};

/**
 *
 * @param {Number} state
 */
function mongodbState(state) {
	switch (state) {
		case 1:
			return 'Connected';
		case 2:
			return 'Connecting';
		case 3:
			return 'Disconnecting';
		default:
			return 'Disconnected';
	}
}
