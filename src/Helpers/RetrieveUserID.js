// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Message } = require('discord.js');

// ██████ | ███████████████████████████████████████████████████████████████████

/**
 *
 * @param {Message} message
 * @param {String} target
 * @return {String}
 */
module.exports = (message, target) => {
	let id = 0;

	if (message.mentions.members.first()) {
		id = message.mentions.members.first().user.id;
	}
	else if (parseInt(target)) {
		id = target;
	}
	else if (!target) {
		id = message.author.id;
	}

	return id;
};
