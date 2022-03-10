// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
// —— Includes config file
const { colors } = require('../../config.json');

// ██████ | ███████████████████████████████████████████████████████████████████

module.exports = (client, message, id, duration) => {
	// —— Add the cooldown to our client collection
	client.cooldowns.set(id, message.createdTimestamp);

	// —— Timer before we delete the cooldown in our collection
	return setTimeout(() => client.cooldowns.delete(id), 1000 * duration);
};
