// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Message, MessageEmbed } = require('discord.js');

// ██████ | ███████████████████████████████████████████████████████████████████

module.exports = {
	name: 'commands',
	category: 'misc',
	description: 'A full list of commands that Daishi has!',

	/**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
	async execute(client, message, args) {
		await message.channel.send('This feature is not quite ready yet. Check back later!');
	},
};
