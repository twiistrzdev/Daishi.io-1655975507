// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client } = require('discord.js');
// —— Events name
const { Events } = require('../Validations/Events');
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
	const Table = new Ascii('Events Handler');

	Table.setHeading('', 'Name', 'File', 'Message');

	(await promisifyGlob(`${process.cwd()}/src/Events/**/*.js`))
		.map(async (eventFile) => {
			const event = require(eventFile);
			const file = path.parse(eventFile).base;

			// —— If name is not set, error
			if (!event.name) {
				return Table.addRow('🔴', '', file, 'Name is required');
			}

			// —— If name is not string, error
			if (typeof event.name !== 'string') {
				return Table.addRow('🔴', '', file, 'Name must be a string type');
			}

			if (!Events.includes(event.name)) {
				return Table.addRow('🔴', '', file, 'Invalid name');
			}

			// —— If once is set and once is not a boolean, error
			if (event.once && typeof event.once !== 'boolean') {
				return Table.addRow('🔴', event.name, file, 'Once must be a boolean type');
			}

			client.events.set(event.name, event);

			if (event.once) {
				client.once(event.name, (...args) => {
					event.callback(...args, client);
				});
			}
			else {
				client.on(event.name, (...args) => {
					event.callback(...args, client);
				});
			}

			return Table.addRow('🟢', event.name, file);
		});

	if (Table.__rows.length) console.log(Table.toString());
};
