// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Message, MessageEmbed } = require('discord.js');

// ██████ | ███████████████████████████████████████████████████████████████████

module.exports = {
	name: 'avatar',
	aliases: ['pfp'],
	category: 'General',
	description: 'Display the profile picture of a member',
	userPermission: 'SEND_MESSAGES',

	/**
	 *
	 * @param {Client} client
	 * @param {Message} message
	 * @param {String[]} args
	 */
	async execute(client, message, args) {
		try {
			let target = message.author.user;

			if (message.mentions.members.first()) {
				target = message.mentions.members.first().user;
			}
			else if (args[0]) {
				target = (await message.guild.members.fetch(args[0])).user;
			}

			// const member = message.guild.members.cache.find(m => m.id === targetId);

			if (target) {

				const Response = new MessageEmbed()
					.setColor('RANDOM')
					.setTitle(`Avatar for ${target.tag}`)
					.setDescription(
						'**Link as**\n' +
						`[png](${target.displayAvatarURL({ size: 512, format: 'png' })}) | ` +
						`[jpg](${target.displayAvatarURL({ size: 512, format: 'jpg' })}) | ` +
						`[webp](${target.displayAvatarURL({ size: 512, format: 'webp' })})`,
					)
					.setImage(target.displayAvatarURL({ dynamic: true, size: 512 }));

				await message.channel.send({ embeds: [Response] });
			}
		}
		catch (e) {
			await message.channel.send('Unable to find that user.');
		}
	},
};
