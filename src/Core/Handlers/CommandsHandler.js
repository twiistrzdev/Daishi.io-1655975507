// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client, Permissions } = require('discord.js');
// —— Returns promises
const { promisify } = require('util');
// —— Glob Filepaths
const { glob } = require('glob');
// —— Platform paths
const path = require('path');
// —— Ascii table
const Ascii = require('ascii-table');
// —— Includes config file
const { defaultCooldownDuration } = require('../../config.json');

// ██████ | ███████████████████████████████████████████████████████████████████

/**
 * Command Handler
 *
 * @param {Client} client
 */
module.exports = async (client) => {
	const Table = new Ascii('Commands Handler');
	const promisifyGlob = promisify(glob);

	Table.setHeading('', 'Name', 'Aliases', 'Category', 'File', 'Message');

	(await promisifyGlob(`${process.cwd()}/src/Commands/**/*.js`))
		.map(async (commandFile) => {
			const command = require(commandFile);
			const file = path.parse(commandFile).base;
			let isCommandError;

			// —— If command name is not present
			if (!command.name) {
				Table.addRow('🔴', '', '', '', file, 'Name is required');
				return isCommandError = true;
			}

			// —— If command name is not string
			if (typeof command.name !== 'string') {
				Table.addRow('🔴', '', '', '', file, 'Name must be a string type');
				return isCommandError = true;
			}

			// —— If usage is set and not string
			if (command.usage && typeof command.usage !== 'string') {
				Table.addRow('🔴', '', '', '', file, 'Usage must be a string type');
				return isCommandError = true;
			}

			// —— START: Aliases
			if (command.aliases) {
				// —— Check if the aliases is instance of array
				if (!(command.aliases instanceof Array)) command.aliases = [command.aliases];

				// —— Loop through the aliases, and check for errors
				command.aliases.forEach(alias => {
					if (typeof alias !== 'string') {
						Table.addRow('🔴', command.name, '', '', file, 'Alias must be a string type');
						return isCommandError = true;
					}

					if (client.aliases.has(alias)) {
						Table.addRow('🔴', command.name, '', '', file, 'Alias already in use');
						return isCommandError = true;
					}

					client.aliases.set(alias, command.name);
				});
			}
			// —— END: Aliases

			// —— If category is set and category is not string type, error
			if (command.category && typeof command.category !== 'string') {
				Table.addRow('🔴', command.name, command.aliases, '', file, 'Category must be a string type');
				return isCommandError = true;
			}

			if (command.category && !client.categories.has(command.category)) {
				client.categories.set(command.category, { name: command.category });
			}

			// —— If cooldown is set and cooldown is not a number type, error
			if (typeof command.cooldown === 'undefined') {
				command.cooldown = defaultCooldownDuration;
			}

			if (typeof command.cooldown !== 'number') {
				Table.addRow('🔴', command.name, command.aliases, command.category, file, 'Cooldown must be a number type');
				return isCommandError = true;
			}

			// —— If dm only
			if (command.dmOnly) {
				if (typeof command.dmOnly === 'string' && command.dmOnly !== 'both') {
					Table.addRow('🔴', command.name, command.aliases, command.category, file, 'DM only must be a boolean type or \'both\' string value');
					return isCommandError = true;
				}

				if (typeof command.dmOnly !== 'boolean' && typeof command.dmOnly !== 'string') {
					Table.addRow('🔴', command.name, command.aliases, command.category, file, 'DM only must be a boolean type or \'both\' string value');
					return isCommandError = true;
				}
			}

			if (!command.dmOnly) command.dmOnly = false;

			// —— If test only is set and is not a boolean, error
			if (command.testOnly && typeof command.testOnly !== 'boolean') {
				Table.addRow('🔴', command.name, command.aliases, command.category, file, 'Test only must be a boolean type');
				return isCommandError = true;
			}

			// —— If owner only is set and is not a boolean, error
			if (command.ownerOnly && typeof command.ownerOnly !== 'boolean') {
				Table.addRow('🔴', command.name, command.aliases, command.category, file, 'Owner only must be a boolean type');
				return isCommandError = true;
			}

			// —— If description is not set, error
			if (!command.description) {
				Table.addRow('🔴', command.name, command.aliases, command.category, file, 'Description is required');
				return isCommandError = true;
			}

			// —— If cooldown is set and description is not a string type, error
			if (command.description && typeof command.description !== 'string') {
				Table.addRow('🔴', command.name, command.aliases, command.category, file, 'Description must be a string type');
				return isCommandError = true;
			}

			// —— START: User Permissions
			command.userPermissions = command.userPermissions ? command.userPermissions : 'SEND_MESSAGES';

			if (command.userPermissions) {
				if (typeof command.userPermissions !== 'string' && !(command.userPermissions instanceof Array)) {
					Table.addRow('🔴', command.name, command.aliases, command.category, file, 'User permissions must be a string or array type');
					return isCommandError = true;
				}

				if (typeof command.userPermissions === 'string') command.userPermissions = [command.userPermissions];

				command.userPermissions.forEach(userPermission => {
					if (!(userPermission in Permissions.FLAGS)) {
						Table.addRow('🔴', command.name, command.aliases, command.category, file, 'Invalid user permissions flag');
						return isCommandError = true;
					}
				});
			}
			// —— END: User Permissions

			// —— START: Client Permissions
			command.clientPermissions = command.clientPermissions ? command.clientPermissions : 'SEND_MESSAGES';

			if (command.clientPermissions) {
				if (typeof command.clientPermissions !== 'string' && !(command.clientPermissions instanceof Array)) {
					Table.addRow('🔴', command.name, command.aliases, command.category, file, 'Client permissions must be a string or array type');
					return isCommandError = true;
				}

				if (typeof command.clientPermissions === 'string') command.clientPermissions = [command.clientPermissions];

				command.clientPermissions.forEach(clientPermission => {
					if (!(clientPermission in Permissions.FLAGS)) {
						Table.addRow('🔴', command.name, command.aliases, command.category, file, 'Invalid client permissions flag');
						return isCommandError = true;
					}
				});
			}
			// —— END: Client Permissions

			// —— START: Subcommands
			if (command.subcommands) {
				command.subcommands.forEach(subcommand => {
					// —— If command name is not present
					if (!subcommand.name) {
						Table.addRow('🔴', command.name, command.aliases, command.category, file, 'Subcommand name is required');
						return isCommandError = true;
					}

					// —— If subcommand name is not string
					if (typeof subcommand.name !== 'string') {
						Table.addRow('🔴', command.name, command.aliases, command.category, file, `Subcommand name must be a string type in '${subcommand.name}'`);
						return isCommandError = true;
					}

					// Check if the subcommand is already in use
					if (client.subcommands.has(`${command.name}:${subcommand.name}`)) {
						Table.addRow('🔴', command.name, command.aliases, command.category, file, `${subcommand.name} subcommand name is already in use`);
						return isCommandError = true;
					}

					// —— If usage is set and not string
					if (subcommand.usage && typeof subcommand.usage !== 'string') {
						Table.addRow('🔴', command.name, command.aliases, command.category, file, `Subcommand usage must be a string type in '${subcommand.name}'`);
						return isCommandError = true;
					}

					// —— If cooldown is set and cooldown is not a number type, error
					if (typeof subcommand.cooldown === 'undefined') {
						subcommand.cooldown = command.cooldown;
					}

					if (typeof subcommand.cooldown !== 'number') {
						Table.addRow('🔴', command.name, command.aliases, command.category, file, `Subcommand cooldown must be a number type in '${subcommand.name}'`);
						return isCommandError = true;
					}

					// —— If dm only
					if (typeof subcommand.dmOnly === 'undefined') {
						subcommand.dmOnly = command.dmOnly;
					}

					if (subcommand.dmOnly) {
						if (typeof subcommand.dmOnly === 'string' && subcommand.dmOnly !== 'both') {
							Table.addRow('🔴', command.name, command.aliases, command.category, file, `Subcommand dm only must be a boolean type or 'both' string value in ${subcommand.name}`);
							return isCommandError = true;
						}

						if (typeof command.dmOnly !== 'boolean' && typeof command.dmOnly !== 'string') {
							Table.addRow('🔴', command.name, command.aliases, command.category, file, `Subcommand dm only must be a boolean type or 'both' string value in ${subcommand.name}`);
							return isCommandError = true;
						}
					}

					// —— If test only is set and is not a boolean, error
					if (typeof subcommand.testOnly === 'undefined') {
						subcommand.testOnly = command.testOnly;
					}

					if (subcommand.testOnly && typeof subcommand.testOnly !== 'boolean') {
						Table.addRow('🔴', command.name, command.aliases, command.category, file, `Subcommand test only must be a boolean type in '${subcommand.name}'`);
						return isCommandError = true;
					}

					// —— If owner only is set and is not a boolean, error
					if (typeof subcommand.ownerOnly === 'undefined') {
						subcommand.ownerOnly = command.ownerOnly;
					}

					if (subcommand.ownerOnly && typeof subcommand.ownerOnly !== 'boolean') {
						Table.addRow('🔴', command.name, command.aliases, command.category, file, `Subcommand owner only must be a boolean type in '${subcommand.name}'`);
						return isCommandError = true;
					}

					// —— If description is not set, error
					if (!subcommand.description) {
						Table.addRow('🔴', command.name, command.aliases, command.category, file, `Subcommand description is required in '${subcommand.name}'`);
						return isCommandError = true;
					}

					// —— START: User Permissions
					subcommand.userPermissions = subcommand.userPermissions || command.userPermissions;

					if (subcommand.userPermissions) {
						if (typeof subcommand.userPermissions !== 'string' && !(subcommand.userPermissions instanceof Array)) {
							Table.addRow('🔴', command.name, command.aliases, command.category, file, `Subcommand user permissions must be a string or array type in '${subcommand.name}'`);
							return isCommandError = true;
						}

						if (typeof subcommand.userPermissions === 'string') subcommand.userPermissions = [subcommand.userPermissions];

						subcommand.userPermissions.forEach(userPermission => {
							if (!(userPermission in Permissions.FLAGS)) {
								Table.addRow('🔴', command.name, command.aliases, command.category, file, `Invalid subcommand user permissions flag in '${subcommand.name}'`);
								return isCommandError = true;
							}
						});
					}
					// —— END: User Permissions

					// —— START: Client Permissions
					subcommand.clientPermissions = subcommand.clientPermissions || command.clientPermissions;

					if (subcommand.clientPermissions) {
						if (typeof subcommand.clientPermissions !== 'string' && !(subcommand.clientPermissions instanceof Array)) {
							Table.addRow('🔴', command.name, command.aliases, command.category, file, `Subcommand client permissions must be a string or array type in '${subcommand.name}'`);
							return isCommandError = true;
						}

						if (typeof subcommand.clientPermissions === 'string') subcommand.clientPermissions = [subcommand.clientPermissions];

						subcommand.clientPermissions.forEach(clientPermission => {
							if (!(clientPermission in Permissions.FLAGS)) {
								Table.addRow('🔴', command.name, command.aliases, command.category, file, `Invalid subcommand client permissions flag in '${subcommand.name}'`);
								return isCommandError = true;
							}
						});
					}
					// —— END: Client Permissions

					client.subcommands.set(`${command.name}:${subcommand.name}`);
				});
			}
			// —— END: Subcommands

			if (!command.callback) {
				Table.addRow('🔴', command.name, command.aliases, '', file, 'Callback is required');
				return isCommandError = true;
			}

			if (command.callback && typeof command.callback !== 'function') {
				Table.addRow('🔴', command.name, command.aliases, '', file, 'Callback must be a function type');
				return isCommandError = true;
			}

			// —— Check if error has triggered
			if (isCommandError) return;

			// —— Add the command to the collection
			client.commands.set(command.name, command);

			// —— If category is not set, warning
			if (!command.category) {
				return Table.addRow('🟡', command.name, command.aliases, '', file, 'Missing category');
			}

			// —— If theres no error or warning
			return Table.addRow('🟢', command.name, command.aliases, command.category, file);
		});

	if (Table.__rows.length) console.log(Table.toString());
};
