// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Message, MessageEmbed } = require('discord.js');
// —— Includes config file
const { colors } = require('../config.json');

// ██████ | ███████████████████████████████████████████████████████████████████

/**
 *
 * @param {Message} message
 * @param {String} type
 * @param {Object[]} permissions
 */
module.exports = (message, type, permissions) => {
	let text;

	switch (type) {
		case 'client': {
			text = `${message.author.username}, I don't have permission to execute this command.`;
			break;
		}
		default: {
			text = `${message.author.username}, You don't have permission to use this command.`;
			break;
		}
	}

	const Response = new MessageEmbed()
		.setColor(colors.error)
		.setAuthor({ name: text })
		.addField('Missing Permissions', `${permissions.join('\n')}`);

	return message
		.reply({ embeds: [Response] })
		.then(reply => setTimeout(() => { reply.delete(); }, 1000 * 15));
};
