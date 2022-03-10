// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Message } = require('discord.js');

// ██████ | ███████████████████████████████████████████████████████████████████

module.exports = {
	// The primary name of the command.
	// Required. String type only.
	name: 'sample',

	// For the correct usage of the command.
	// Optional. String type only.
	usage: '[usage]',

	// Alternative aliases.
	// Optional. Can be a string or an array of strings.
	aliases: ['sample', 's'],

	// Category where this command belongs to.
	// Optional. String type only.
	category: 'Sample',

	// How long the user needs to wait before using this command again.
	// Optional. Number type only. Defaults to 3secs.
	cooldown: 30,

	// If the command is only executable in dm, both, or servers only
	// Values must be boolean and 'both'
	dmOnly: 'both',

	// Forces this command to only be callable from whitelisted guild IDs.
	// You can define these IDs in the config.json 'whitelist.guilds' array.
	// Optional. Boolean type only. Defaults to false.
	testOnly: true,

	// Forces this command to only be callable from whitelisted user IDs.
	// You can define these IDs in the config.json 'whitelist.users' array.
	// Optional. Boolean type only. Defaults to false.
	ownerOnly: true,

	// Description of this command.
	// Required. String type only.
	description: 'Sample command.',

	// What Discord permissions the user needs to run the command.
	// Note that invalid permissions will throw an error to prevent typos.
	// Optional. Can be a string or an array of strings. Defaults to 'SEND_MESSAGES'.
	userPermissions: 'ADMINISTRATOR',

	// What Discord permissions the client needs to run the command.
	// Note that invalid permissions will throw an error to prevent typos.
	// Optional. Can be a string or an array of strings. Defaults to 'SEND_MESSAGES'.
	clientPermissions: 'ADMINISTRATOR',

	// Subcommands.
	// If the cooldown, testOnly, ownerOnly, permissions is not present in subcommand.
	// Defaults to command cooldown, testOnly, ownerOnly, permissions.
	// Optional. Array type only.
	subcommands: [
		{
			// Required. String type only.
			name: 'sub_one',

			// Optional. String type only.
			usage: '[sub_one usage]',

			// Optional.
			cooldown: 3,

			// Optional.
			dmOnly: 'both',

			// Optional.
			testOnly: true,

			// Optional.
			ownerOnly: true,

			// Required.
			description: 'Subcommand information.',

			// Optional.
			userPermissions: 'ADMINISTRATOR',

			// Optional.
			clientPermissions: 'ADMINISTRATOR',
		},
	],

	/**
     * Command to be executed
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
	async callback(client, message, args) {
		console.log(client.subcommands);
		console.log(client.application.owner);
		console.log(message.author.tag);
		console.log(args);

		return message.channel.send({
			content: 'This feature is not quite ready yet. Check back later! uwu',
		});
	},

};
