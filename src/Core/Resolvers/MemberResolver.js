// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Guild, Message, GuildMember } = require('discord.js');

// ██████ | ███████████████████████████████████████████████████████████████████

/**
 * Guild member resolver by mention, id, username, nickname.
 *
 * @param {Guild|Message} from
 * @param {String} target
 * @returns {?GuildMember}
 */
module.exports = (from, target = undefined) => {
	if (!(from instanceof Guild || from instanceof Message)) {
		throw new TypeError('Invalid source provided.');
	}

	// —— If target is undefined and from is instance of discord message, set target to message author id
	if (typeof target === 'undefined' && from instanceof Message) {
		target = from.author.id;
	}

	const filter = '^<(@!?)([0-9]+)>';
	const match = target.match(new RegExp(filter));

	if (match) target = match[2];
	if (from instanceof Message) from = from.guild;

	return from.members.cache.find(m => m.id === target || (m.user.username).toLowerCase() === target || (m.nickname ? (m.nickname).toLowerCase() : m.nickname) === target);
	// if (!member) member = from.members.cache.find(m => (m.nickname ? (m.nickname).toLowerCase() : m.nickname) === target);
};
