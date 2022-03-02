// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Message, MessageEmbed } = require('discord.js');
// —— Includes config file
const { color } = require('../config.json');

// ██████ | ███████████████████████████████████████████████████████████████████

/**
 *
 * @param {MessageEmbed} Response
 * @param {Client} client
 * @param {Message} message
 * @param {String} commandName
 * @param {String} subcommandName
 * @returns {MessageEmbed}
 */
module.exports = async (Response, client, message, commandName, subcommandName) => {
	const command = client.commands.get(commandName);
	const subcommand = command.subcommands.find(sc => sc.name === subcommandName);

	Response.setColor(color.error);
	Response.setAuthor({
		name: `${command.name} ${subcommand.name}`,
		iconURL: message.author.displayAvatarURL({ dynamic: true, size: 512 }),
	});
	Response.addField('Usage', `\`${client.prefix}${command.name} ${subcommand.name} ${subcommand.usage}\``);
	Response.setFooter({ text: subcommand.description });
	return message.channel.send({ embeds: [Response] });
};
