// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Message, MessageEmbed } = require('discord.js');
// —— Config
const { supportGuild, issueTracker } = require('../../config.json');
// —— Command usage helper
const CommandUsage = require('../../Helpers/CommandUsage');
const RetrieveUserID = require('../../Helpers/RetrieveUserID');
// —— Subcommand usage helper
const SubcommandUsage = require('../../Helpers/SubcommandUsage');

// ██████ | ███████████████████████████████████████████████████████████████████

module.exports = {
	name: 'user',
	usage: '[subcommand]',
	aliases: ['userinfo'],
	category: 'info',
	description: 'User information commands.',
	userPermission: 'SEND_MESSAGES',
	subcommands: [
		{
			name: 'info',
			usage: '[user]',
			description: 'All information of a user.',
		},
		{
			name: 'avatar',
			usage: '[user]',
			description: 'Get a user\'s avatar and the url.',
		},
		{
			name: 'banner',
			usage: '[user]',
			description: 'Get a user\'s banner and the url.',
		},
		{
			name: 'age',
			usage: '[user]',
			description: 'Check the account and server age of a user.',
		},
		{
			name: 'permissions',
			usage: '[user]',
			description: 'Show the permissions a user has. Provide a channel to get the permissions of the user in a specific channel.',
		},
		{
			name: 'id',
			usage: '[user]',
			description: 'Get a user\'s ID.',
		},
	],

	/**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
	async execute(client, message, args) {
		const Response = new MessageEmbed();
		const subcommandName = args[0];

		// —— Check if the subcommand is invalid or missing
		if (!subcommandName || !this.subcommands.find(subcommand => subcommand.name === subcommandName)) {
			return CommandUsage(Response, client, message, this.name);
		}

		if (subcommandName) {
			// —— Retrieve user id from mention, given id, author
			const targetID = RetrieveUserID(message, args[1]);

			// —— Get the guild member by ID
			const member = message.guild.members.cache.find(m => m.id === targetID);

			// —— Check if subcommand usage is invalid
			if (this.subcommands.find(subcommand => subcommand.name === subcommandName) && !member) {
				return SubcommandUsage(Response, client, message, this.name, subcommandName);
			}

			Response.setColor('AQUA');

			if (subcommandName === 'info') {
				Response.setAuthor({
					name: `${member.user.tag} | User Information`,
					iconURL: member.displayAvatarURL({ dynamic: true, size: 512 }),
				});
				Response.setThumbnail(member.displayAvatarURL({ dynamic: true, size: 512 }));
				Response.setDescription(`ID: ${member.id}`);

				// —— Check if user has nickname
				if (member.nickname) Response.addField('Nickname', member.nickname);

				// —— Creation and Join Date
				Response.addField('Creation Date', `<t:${parseInt(member.user.createdTimestamp / 1000)}:f>`);
				Response.addField('Join Date', `<t:${parseInt(member.joinedTimestamp / 1000)}:f>`);

				// —— Check if user has boosted the server
				if (member.premiumSince) Response.addField('Boosted Date', `<t:${parseInt(member.premiumSinceTimestamp / 1000)}:f>`);

				Response.addField('Permissions', member.permissions.toArray().toString());
				// Response.addField('Roles', member.roles.cache.toArray().toString());
			}
		}

		return message.channel.send({ embeds: [Response] });
	},
};
