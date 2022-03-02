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
 * @returns {MessageEmbed}
 */
module.exports = async (Response, client, message, commandName) => {
	const command = client.commands.get(commandName);

	Response.setColor(color.error);
	Response.setAuthor({
		name: `${command.name}`,
		iconURL: message.author.displayAvatarURL({ dynamic: true, size: 512 }),
	});

	// —— Check if theres a subcommands in command
	if (command.subcommands) {
		const subcommands = [];

		command.subcommands.forEach(subcommand => {
			subcommands.push(`\`${client.prefix}${commandName} ${subcommand.name}\` - ${subcommand.description}`);
		});

		Response.addField('Subcommands', subcommands.join('\n'));
	}

	// —— Else, Show the command usage instead
	else {
		Response.addField('Usage', `\`${client.prefix}${command.name} ${command.usage}\``);
	}

	Response.setFooter({ text: command.description });
	return message.channel.send({ embeds: [Response] });
};
