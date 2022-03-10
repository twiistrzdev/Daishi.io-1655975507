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
 * @param {String} subcommandName
 */
module.exports = async (client, message, commandName, subcommandName) => {
	const command = client.commands.get(commandName);
	const subcommand = command.subcommands.find(sc => sc.name === subcommandName);

	const Response = new MessageEmbed()
		.setColor(colors.primary)
		.setAuthor({
			name: `${command.name} ${subcommand.name}`,
			iconURL: message.author.displayAvatarURL({ dynamic: true, size: 512 }),
		})
		.addField('Usage', `\`${client.prefix}${command.name} ${subcommand.name} ${subcommand.usage}\``)
		.setFooter({ text: `${subcommand.description}` });

	return ResolveChannel(message).send({ embeds: [Response] });
};
