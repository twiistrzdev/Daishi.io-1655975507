// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Guild, Message, AnyChannel } = require('discord.js');

// ██████ | ███████████████████████████████████████████████████████████████████

/**
 * Channel resolver by mention, id.
 *
 * @param {Client|Guild|Message} from
 * @param {String} target
 * @returns {AnyChannel}
 */
module.exports = (from, target = undefined) => {
	if (!(from instanceof Client || from instanceof Guild || from instanceof Message)) {
		throw new TypeError('Invalid source provided.');
	}

	// —— If target is undefined and from is instance of discord message, set target to message channel id
	if (typeof target === 'undefined' && from instanceof Message) {
		target = from.channel.id;
	}

	const filter = '^<(#)([0-9]+)>';
	const match = target.match(new RegExp(filter));

	if (match) target = match[2];
	if (from instanceof Message) from = from.guild;

	return from.channels.cache.find(ch => ch.id === target);
};
