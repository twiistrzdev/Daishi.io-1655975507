// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Message } = require('discord.js');

// ██████ | ███████████████████████████████████████████████████████████████████

module.exports = {
	name: 'tester',
	aliases: ['t'],
	category: 'Testing',
	cooldown: 15,
	testOnly: false,
	ownerOnly: false,
	description: 'Tester.',
	// userPermissions: 'ADMINISTRATOR',
	clientPermissions: 'ADMINISTRATOR',

	/**
     * Command to be executed
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
	async callback(client, message, [target]) {
		console.log(client.categories);
		return message.channel.send({
			content: 'Tester',
		});
	},

};
