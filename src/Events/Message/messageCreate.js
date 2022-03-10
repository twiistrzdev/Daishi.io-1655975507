// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Message, Permissions } = require('discord.js');
// —— Includes cooldown checker
const CooldownCheck = require('../../Helpers/Cooldown/Check');
// —— Includes cooldown timer
const CooldownTimer = require('../../Helpers/Cooldown/Timer');
// —— Includes dm only
const DmOnly = require('../../Helpers/DmOnly');
// —— Includes not ready
const NotReady = require('../../Helpers/NotReady');
// —— Includes no permission
const NoPermission = require('../../Helpers/NoPermission');
// —— Includes command usage
const CommandUsage = require('../../Helpers/Usage/CommandUsage');
// —— Includes config
const { whitelist } = require('../../config.json');

// ██████ | ███████████████████████████████████████████████████████████████████

module.exports = {
	name: 'messageCreate',

	/**
     * Client on message create event.
	 *
     * @param {Message} message
     * @param {Client} client
     */
	async callback(message, client) {
		const prefix = client.prefix;

		// —— If the message content doesn't starts with prefix or if the author is a bot, return
		if (!message.content.startsWith(prefix) || message.author.bot) return;

		const args = message.content.slice(prefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();
		const subcommandName = args[0] ? args[0].toLowerCase() : args[0];
		const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));

		if (command) {
			const subcommand = command.subcommands ? command.subcommands.find(sc => (sc.name).toLowerCase() === subcommandName) : false;
			let cooldownId = `${message.author.id}-${command.name}`;
			let cooldownDuration = command.cooldown;

			// —— Check message channel type the modify the cooldown id
			cooldownId = message.channel.type !== 'DM' ? `${message.guild.id}-${cooldownId}` : cooldownId;

			// —— If the subcommand is present and subcommand cooldown is set change the id and duration
			cooldownId = subcommand ? `${cooldownId}-${subcommand.name}` : cooldownId;
			cooldownDuration = (subcommand && typeof subcommand.cooldown === 'number') ? subcommand.cooldown : cooldownDuration;

			if (CooldownCheck(client, message, cooldownId, cooldownDuration)) return;

			// —— START: Subcommands

			// —— If the subcommands key are set and if the subcommand is present in the array set
			if (command.subcommands && subcommand) {
				if (message.channel.type === 'DM' && !subcommand.dmOnly) return;

				if ((message.channel.type !== 'DM' && (subcommand.testOnly && !whitelist.guilds.includes(message.guild.id))) ||
					(subcommand.ownerOnly && !whitelist.users.includes(message.author.id))) {
					// —— Display subcommand not ready yet
					return NotReady(message);
				}

				if (message.channel.type !== 'DM' && subcommand.dmOnly && subcommand.dmOnly !== 'both') {
					return DmOnly(message);
				}

				if (message.channel.type !== 'DM') {
					if (!(message.guild.me.permissions.has(subcommand.clientPermissions))) {
						return NoPermission(message, 'client', subcommand.clientPermissions);
					}

					if (!(message.member.permissions.has(subcommand.userPermissions))) {
						return NoPermission(message, 'user', subcommand.userPermissions);
					}
				}
			}
			// —— END: Subcommands

			if (!command.subcommands || (command.subcommands && !subcommand)) {
				if (message.channel.type === 'DM' && !command.dmOnly) return;

				if ((message.channel.type !== 'DM' && (command.testOnly && !whitelist.guilds.includes(message.guild.id))) ||
					(command.ownerOnly && !whitelist.users.includes(message.author.id))) {
					// —— Display command not ready yet
					return NotReady(message);
				}

				if (message.channel.type !== 'DM' && command.dmOnly && command.dmOnly !== 'both') {
					return DmOnly(message);
				}

				if (message.channel.type !== 'DM') {
					if (!(message.guild.me.permissions.has(command.clientPermissions))) {
						return NoPermission(message, 'client', command.clientPermissions);
					}

					if (!(message.member.permissions.has(command.userPermissions))) {
						return NoPermission(message, 'user', command.userPermissions);
					}
				}

				if (command.subcommands && !subcommand) {
					// —— Display command usage if the subcommand is not valid
					return CommandUsage(client, message, command.name);
				}
			}

			// —— Executes the command
			CooldownTimer(client, message, cooldownId, cooldownDuration);
			return await command.callback(client, message, args);
		}
	},
};
