// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Message, MessageEmbed } = require('discord.js');
// —— Includes config file
const { prefix } = require('../../config.json');

// ██████ | ███████████████████████████████████████████████████████████████████

module.exports = {
	name: 'messageCreate',

	/**
     *
     * @param {Message} message
     * @param {Client} client
     */
	async execute(message, client) {
		if (!message.content.startsWith(prefix) || message.author.bot || message.channel.type === 'DM') return;

		const args = message.content.slice(prefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();
		const command = client.commands.get(commandName) ||
            client.commands.get(client.commandsAliases.get(commandName));

		if (command) {
			// —— Check user and client permission before executing the command
			const Error = new MessageEmbed()
				.setColor('RED')
				.setFooter({ text: `ID: ${message.member.id}` });

			if (command.clientPermission) {
				if (!message.guild.me.permissions.has(command.clientPermission)) {
					Error
						.setDescription(`${message.member}, I don't have permission to execute the **${commandName}** command.`)
						.addField('Missing Permission Node', command.clientPermission);

					return message.channel.send({ embeds: [Error] });
				}
			}

			if (command.userPermission) {
				if (!message.member.permissions.has(command.userPermission)) {
					Error
						.setDescription(`${message.member}, you don't have permission to use the **${commandName}** command.`)
						.addField('Missing Permission Node', command.userPermission);

					return message.channel.send({ embeds: [Error] });
				}
			}

			command.execute(client, message, args);
		}
	},
};
