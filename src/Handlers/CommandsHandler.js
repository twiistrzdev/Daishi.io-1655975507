// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client } = require('discord.js');
// —— Permissions node
const { Permissions } = require('../Validations/Permissions');
// —— Returns promises
const { promisify } = require('util');
// —— Glob Filepaths
const { glob } = require('glob');
// —— Platform paths
const path = require('path');
// —— Ascii table
const Ascii = require('ascii-table');

// ██████ | ███████████████████████████████████████████████████████████████████

/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
	const promisifyGlob = promisify(glob);
	const table = new Ascii('Commands Handler');

	table.setHeading('Status', 'Name', 'Aliases', 'Category', 'File', 'Message');

	(await promisifyGlob(`${process.cwd()}/src/Commands/**/*.js`))
		.map(async (commandFile) => {
			const command = require(commandFile);
			const file = path.parse(commandFile).base;

			if (!command.name) {
				return table.addRow('🔴 Error', '', '', '', file, 'Invalid or missing command name.');
			}

			if (command.aliases) {
				if (!Array.isArray(command.aliases)) command.aliases = [command.aliases];
				command.aliases.forEach(alias => client.commandsAliases.set(alias, command.name));
			}

			if (command.userPermission) {
				if (!Permissions.includes(command.userPermission)) {
					return table.addRow('🔴 Error', command.name, command.aliases, command.category, file, 'Invalid user permission node.');
				}
			}

			if (command.clientPermission) {
				if (!Permissions.includes(command.clientPermission)) {
					return table.addRow('🔴 Error', command.name, command.aliases, command.category, file, 'Invalid client permission node.');
				}
			}

			if (!command.category) {
				client.commands.set(command.name, command);
				return table.addRow('🟡 Warning', command.name, command.aliases, '', file, 'Missing category');
			}

			client.commands.set(command.name, command);
			return table.addRow('🟢 Registered', command.name, command.aliases, command.category, file);
		});

	console.log(table.toString());
};
