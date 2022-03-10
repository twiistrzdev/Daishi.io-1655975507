// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Guild } = require('discord.js');
// —— Includes config file
const { guild } = require('../../config.json');

// ██████ | ███████████████████████████████████████████████████████████████████

/**
 * Guild resolver by id.
 *
 * @param {Client} client
 * @param {String} target
 * @returns {?Guild}
 */
module.exports = (client, target) => {
	if (!(client instanceof Client)) {
		throw new TypeError('Invalid source provided.');
	}

	// —— If target is undefined, set target to guild id in config file
	if (typeof target === 'undefined') {
		target = guild.id;
	}

	return client.guilds.cache.find(g => g.id === target);
};
