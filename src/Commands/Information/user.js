// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Message, MessageEmbed } = require('discord.js');
// —— Includes config file
const { supportGuild, issueTracker, color } = require('../../config.json');
// —— Command usage helper
const CommandUsage = require('../../Helpers/CommandUsage');
// —— Retrieve user id helper
const RetrieveUserID = require('../../Helpers/RetrieveUserID');
// —— Subcommand usage helper
const SubcommandUsage = require('../../Helpers/SubcommandUsage');
const xios = require('axios');
const { default: axios } = require('axios');

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

			Response.setColor(color.primary);

			if (subcommandName === 'info') {
				Response.setAuthor({
					name: `${member.user.tag} | User Information`,
					iconURL: member.displayAvatarURL({ dynamic: true, size: 1024 }),
				});
				Response.setThumbnail(member.displayAvatarURL({ dynamic: true, size: 1024 }));
				Response.setDescription(`ID: ${member.id}`);

				// —— Check if user has nickname
				if (member.nickname) Response.addField('Nickname', member.nickname);

				// —— Creation and Join Date
				Response.addField('Creation Date', `<t:${parseInt(member.user.createdTimestamp / 1000)}:f>`);
				Response.addField('Join Date', `<t:${parseInt(member.joinedTimestamp / 1000)}:f>`);

				// —— Check if user has boosted the server
				if (member.premiumSince) Response.addField('Boosted Date', `<t:${parseInt(member.premiumSinceTimestamp / 1000)}:f>`);

				let permissions = '';
				if (member.guild.ownerId === member.id) {
					permissions = '<:Perms_Owner:949547766705713152> Owner';
				}
				else if (member.user.bot) {
					permissions = '<:Perms_Bot:949547766617632788> Bot';
				}
				else if (member.permissions.has('ADMINISTRATOR')) {
					permissions = '<:Perms_Administrator:949547766554705940> Administrator';
				}
				else {
					permissions = '<:Perms_Member:949547766508552282> Member';
				}

				Response.addField('Permissions', permissions);
				// Response.addField('Roles', member.roles.cache.toArray().toString());

				await axios
					.get(`https://discord.com/api/users/${member.id}`, {
						headers: {
							Authorization: `Bot ${client.token}`,
						},
					})
					.then(result => {
						const { banner } = result.data;

						if (banner) {
							const extension = banner.startsWith('a_') ? '.gif' : '.png';
							const dynamic = `https://cdn.discordapp.com/banners/${member.id}/${banner}${extension}?size=1024`;

							Response.setImage(dynamic);
						}
					});
			}
			else if (subcommandName === 'avatar') {
				Response.setAuthor({
					name: `${member.user.tag} | Avatar`,
					iconURL: member.displayAvatarURL({ dynamic: true, size: 1024 }),
				});
				Response.setDescription(
					'**Link as**\n' +
					`[png](${member.displayAvatarURL({ format: 'png', size: 1024 })})` +
					` | [jpg](${member.displayAvatarURL({ format: 'jpg', size: 1024 })})` +
					` | [webp](${member.displayAvatarURL({ format: 'webp', size: 1024 })})` +
					`${member.user.avatar.startsWith('a_') ? ` | [gif](${member.displayAvatarURL({ format: 'gif', size: 1024 })})` : ''}`,
				);
				Response.setImage(member.displayAvatarURL({ dynamic: true, size: 1024 }));
			}
			else if (subcommandName === 'banner') {
				Response.setAuthor({
					name: `${member.user.tag} | Banner`,
					iconURL: member.displayAvatarURL({ dynamic: true, size: 1024 }),
				});

				await axios
					.get(`https://discord.com/api/users/${member.id}`, {
						headers: {
							Authorization: `Bot ${client.token}`,
						},
					})
					.then(result => {
						const { banner, accent_color } = result.data;

						if (banner) {
							const extension = banner.startsWith('a_') ? '.gif' : '.png';
							const url = `https://cdn.discordapp.com/banners/${member.id}/${banner}`;
							const dynamic = `${url}${extension}?size=1024`;

							Response.setDescription(
								'**Link as**\n' +
								`[png](${url}.png?size=1024)` +
								` | [jpg](${url}.jpg?size=1024)` +
								` | [webp](${url}.webp?size=1024)` +
								`${banner.startsWith('a_') ? ` | [gif](${dynamic})` : ''}`,
							);
							Response.setImage(dynamic);
						}
						else if (accent_color) {
							Response.setDescription(`${member} doesn't have any banner but they do have an accent color: \`${accent_color}\`.`);
						}
						else {
							Response.setDescription(`${member} does not have a banner nor accent color.`);
						}
					});

			}
		}

		return message.channel.send({ embeds: [Response] });
	},
};
