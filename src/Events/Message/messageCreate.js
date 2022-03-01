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
			const Response = new MessageEmbed();
			Response.setColor('RED');

			// —— Check client permission
			if (command.clientPermission) {
				if (!message.guild.me.permissions.has(command.clientPermission)) {
					Response.setDescription(`${message.member}, I don't have permission to execute the **${commandName}** command.`);
					Response.addField('Missing Permission', command.clientPermission);
					return message.channel.send({ embeds: [Response] });
				}
			}

			// —— Check user permission
			if (command.userPermission) {
				if (!message.member.permissions.has(command.userPermission)) {
					Response.setDescription(`${message.member}, you don't have permission to use the **${commandName}** command.`);
					Response.addField('Missing Permission', command.userPermission);
					return message.channel.send({ embeds: [Response] });
				}
			}

			// —— Fetch the members to cache
			await message.guild.members.fetch();

			// —— Executes the command
			await command.execute(client, message, args, prefix);
		}
	},
};
