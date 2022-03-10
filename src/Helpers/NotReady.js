// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Message, MessageEmbed } = require('discord.js');
// —— Includes config file
const { colors } = require('../config.json');

// ██████ | ███████████████████████████████████████████████████████████████████

/**
 *
 * @param {Message} message
 * @param {String} command
 */
module.exports = (message) => {
	const Response = new MessageEmbed()
		.setColor(colors.error)
		.setAuthor({ name: 'This feature is not quite ready yet. Check back later! UwU' });

	return message
		.reply({ embeds: [Response] })
		.then(reply => setTimeout(() => { reply.delete(); }, 1000 * 15));
};
