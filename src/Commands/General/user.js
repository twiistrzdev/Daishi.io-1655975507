// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Message, MessageEmbed } = require('discord.js');
// —— Node fetch
const fetch = require('node-fetch');

// ██████ | ███████████████████████████████████████████████████████████████████

module.exports = {
	name: 'user',
	aliases: ['userinfo'],
	category: 'General',
	description: 'Display the information about user.',
	userPermission: 'SEND_MESSAGES',

	/**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
	async execute(client, message, args) {
		try {
			let targetId = message.author.id;

			if (message.mentions.members.first()) {
				targetId = message.mentions.members.first().user.id;
			}
			else if (parseInt(args[0])) {
				targetId = (await message.guild.members.fetch(args[0])).user.id;
			}

			const member = message.guild.members.cache.find((m) => m.id === targetId);

			if (member) {
				const Response = new MessageEmbed()
					.setColor('RANDOM')
					.setTitle(`Information for ${member.user.tag}`)
					.addField('User ID', member.id)
					.addField('Nickname', member.nickname || '_ _', true)
					.addField('Username', member.user.username, true)
					.addField('Discriminator', member.user.discriminator, true)
					.addField('Registered At', `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`, true)
					.addField('Joined At', `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`, true)
					.addField(
						'Booster Since',
						member.premiumSinceTimestamp ? `<t:${parseInt(member.premiumSinceTimestamp / 1000)}:R>` : '_ _',
						true,
					)
					.setThumbnail(member.displayAvatarURL({ dynamic: true, size: 512 }))
					.setImage(`https://cdn.discordapp.com/banners/${member.id}/${member.user.banner}?size=4096`);

				// const ApiResponse = fetch(`https://discord.com/api/v8/users/${member.id}`, {
				// 	method: 'GET',
				// 	headers: {
				// 		Authorization: `Bot ${process.env.TOKEN}`,
				// 	},
				// });

				// let receive = '';
				// let banner = '';

				// ApiResponse.then(api => {
				// 	if (api.status !== 404) {
				// 		api.json()
				// 			.then((data) => {
				// 				receive = data['banner'];

				// 				if (receive !== null) {
				// 					let format = 'png';

				// 					if (receive.substring(0, 2) === 'a_') {
				// 						format = 'gif';
				// 					}

				// 					banner = `https://cdn.discordapp.com/banners/${member.id}/${receive}.${format}?size=4096`;
				// 				}
				// 			});
				// 	}
				// });

				// console.log('');

				await message.channel.send({ embeds: [Response] });
			}
		}
		catch (error) {
			await message.channel.send(error.message);
		}
	},
};
