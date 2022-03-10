// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Message, MessageEmbed } = require('discord.js');
// —— Includes config file
const { colors } = require('../../config.json');

// ██████ | ███████████████████████████████████████████████████████████████████

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {String} id
 * @param {Number} duration
 */
module.exports = (client, message, id, duration) => {
	if (client.cooldowns.has(id)) {
		const Response = new MessageEmbed();
		const lastMessageTimestamp = client.cooldowns.get(id);
		const timer = (duration - ((message.createdTimestamp - lastMessageTimestamp) / 1000)).toFixed(0);
		const cooldown = (timer === 0) ? 'Ready' : `${message.author.username}, please cool down! (${timer} second${timer > 1 ? 's' : ''} left)`;

		Response.setColor(colors.error);
		Response.setAuthor({ name: `${cooldown}` });

		return message
			.reply({ embeds: [Response] })
			.then(reply => setTimeout(() => { reply.delete(); }, 1000 * 5));
	}

	return false;
};
