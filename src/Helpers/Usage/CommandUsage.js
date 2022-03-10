// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Message, MessageEmbed } = require('discord.js');
// —— Includes channel resolver
const ResolveChannel = require('../../Core/Resolvers/ChannelResolver');
// —— Includes config file
const { colors } = require('../../config.json');

// ██████ | ███████████████████████████████████████████████████████████████████

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {String} commandName
 */
module.exports = async (client, message, commandName) => {
	const command = client.commands.get(commandName);
	const subcommands = [];

	const Response = new MessageEmbed()
		.setColor(colors.primary)
		.setAuthor({
			name: command.name,
			iconURL: message.author.displayAvatarURL({ dynamic: true, size: 512 }),
		})
		.setFooter({ text: command.description });

	if (command.subcommands) {
		command.subcommands.forEach(subcommand => {
			subcommands.push(`\`${client.prefix}${command.name} ${subcommand.name}\` - ${subcommand.description}`);
		});

		Response.addField('Subcommands', subcommands.join('\n'));
	}
	else {
		Response.addField('Usage', `\`${client.prefix}${command.name}${command.usage ? ' ' + command.usage : ''}\``);
	}

	return ResolveChannel(message).send({ embeds: [Response] });
};
