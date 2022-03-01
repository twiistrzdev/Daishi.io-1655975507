// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Message, MessageEmbed } = require('discord.js');

// ██████ | ███████████████████████████████████████████████████████████████████

module.exports = {
	name: 'ping',
	category: 'misc',
	description: 'Pong!',

	/**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
	async execute(client, message, args) {
		console.log(this.name, this.description);
	},
};
