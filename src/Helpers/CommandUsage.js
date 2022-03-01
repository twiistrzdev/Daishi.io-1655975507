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
 * @param {String} description
 * @param {String[]} subcommands
 * @returns {MessageEmbed}
 */
module.exports = async (Response, message, prefix, command, description, subcommands) => {
	Response.setColor('RED');
	Response.setAuthor({
		name: `${command}`,
		iconURL: message.author.displayAvatarURL({ dynamic: true, size: 512 }),
	});
	const scs = [];

	subcommands.forEach(subcommand => {
		scs.push(`\`${prefix}${command} ${subcommand.name}\` - ${subcommand.description}`);
	});

	Response.addField('Subcommands', scs.join('\n'));
	Response.setFooter({ text: description });
	return Response;
};
