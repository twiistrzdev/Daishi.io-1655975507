// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Message, MessageEmbed } = require('discord.js');
const { supportGuild, inviteLink } = require('../../config.json');

// ██████ | ███████████████████████████████████████████████████████████████████

module.exports = {
	name: 'help',
	usage: '[command]',
	category: 'misc',
	description: 'I need somebody. Help! Not just anybody. Help!',

	/**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
	async execute(client, message, args, prefix) {
		const Response = new MessageEmbed();

		if (args[0]) {
			const command = client.commands.get(args[0]) ||
				client.commands.get(client.commandsAliases.get(args[0]));

			if (command) {
				Response.setColor('AQUA');
				Response.setAuthor({
					name: command.name,
					iconURL: client.user.displayAvatarURL({ dynamic: true, size: 512 }),
				});
				Response.addField('Usage', `\`${prefix}${command.name} ${command.usage || ''}\``);

				if (command.aliases) Response.addField('Aliases', command.aliases.join(', '));

				if (command.subcommands) {
					const subcommands = [];

					await command.subcommands.forEach(subcommand => {
						subcommands.push(`\`${prefix}${command.name} ${subcommand.name}\` - ${subcommand.description}`);
					});

					Response.addField('Subcommands', subcommands.join('\n'));
				}

				Response.setFooter({ text: command.description });
			}
			else {
				Response.setColor('RED');
				Response.setTitle('That is not a valid command!');
			}
		}
		else {
			Response.setColor('AQUA');
			Response.setAuthor({
				name: `${client.user.username} | Help`,
				iconURL: message.author.displayAvatarURL({ dynamic: true, size: 512 }),
			});
			Response.setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 512 }));
			Response.setDescription(
				'Daishitie Bot Framework\n' +
				'For Development and Testings',
			);
			Response.addField('📃 Commands', `Use \`${prefix}commands\` for a full list of commands`);
			Response.addField('❓ Support', `Join the [support server](${supportGuild})`);
			Response.addField('🔗 Invite', `[Invite Daishitie](${inviteLink}) to your server`);
			// Response.addField('💶 Donate', 'Donate to Daishitie development');
		}

		await message.channel.send({ embeds: [Response] });
	},
};
