// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Message, MessageEmbed } = require('discord.js');

// ██████ | ███████████████████████████████████████████████████████████████████

/**
 *
 * @param {MessageEmbed} Response
 * @param {Message} message
 * @param {String} prefix
 * @param {String} command
 * @param {String} subcommand
 * @param {String} usage
 * @param {String} description
 * @returns {MessageEmbed}
 */
module.exports = async (Response, message, prefix, command, subcommand, usage, description) => {
	Response.setColor('RED');
	Response.setAuthor({
		name: `${command} ${subcommand}`,
		iconURL: message.author.displayAvatarURL({ dynamic: true, size: 512 }),
	});
	Response.addField('Usage', `\`${prefix}${command} ${subcommand} ${usage}\``);
	Response.setFooter({ text: description });
	return Response;
};
