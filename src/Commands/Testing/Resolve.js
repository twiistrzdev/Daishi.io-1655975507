// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Message } = require('discord.js');
// —— Includes member resolver
const ResolveMember = require('../../Core/Resolvers/MemberResolver');
// —— Includes channel resolver
const ResolveChannel = require('../../Core/Resolvers/ChannelResolver');
// —— Includes guild resolver
const ResolveGuild = require('../../Core/Resolvers/GuildResolver');
// —— Includes subcommand usage
const SubcommandUsage = require('../../Helpers/Usage/SubcommandUsage');

// ██████ | ███████████████████████████████████████████████████████████████████

module.exports = {
	name: 'resolve',
	usage: '[type]',
	aliases: ['r'],
	category: 'Testing',
	cooldown: 15,
	ownerOnly: false,
	description: 'Resolve tester.',
	userPermissions: 'ADMINISTRATOR',
	clientPermissions: 'ADMINISTRATOR',
	subcommands: [
		{
			name: 'member',
			usage: '[member]',
			cooldown: 0,
			ownerOnly: false,
			description: 'Resolve member by mention, id, username, nickname.',
			userPermissions: ['SEND_MESSAGES'],
			clientPermissions: 'ADMINISTRATOR',
		},
		{
			name: 'channel',
			usage: '[channel]',
			ownerOnly: true,
			description: 'Resolve channel by mention, id, name.',
			userPermissions: 'ADMINISTRATOR',
			clientPermissions: 'ADMINISTRATOR',
		},
		{
			name: 'guild',
			usage: '[guild]',
			ownerOnly: true,
			description: 'Resolve guild by id.',
			userPermissions: 'ADMINISTRATOR',
			clientPermissions: 'ADMINISTRATOR',
		},
	],

	/**
     * Command to be executed
     *
     * @param {Client} client
     * @param {Message} message
	 * @param {Object[]} args
     * @param {String} args[].subcommandName
	 * @param {String} args[].target
     */
	async callback(client, message, [subcommandName, target]) {
		switch (subcommandName) {
			case 'member': {
				if (ResolveMember(message, target)) {
					return message.channel.send(`${ResolveMember(message, target)}`);
				}
				break;
			}

			case 'channel': {
				if (ResolveChannel(message, target)) {
					return message.channel.send(`${ResolveChannel(message, target)}`);
				}
				break;
			}

			case 'guild': {
				if (ResolveGuild(client, target)) {
					return message.channel.send(`${ResolveGuild(client, target)}`);
				}
				break;
			}
		}

		return SubcommandUsage(client, message, this.name, subcommandName);
	},

};
