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
	const table = new Ascii('Events Handler');

	table.setHeading('Status', 'Name', 'File', 'Message');

	(await promisifyGlob(`${process.cwd()}/src/Events/**/*.js`))
		.map(async (eventFile) => {
			const event = require(eventFile);
			const file = path.parse(eventFile).base;

			if (!event.name || !Events.includes(event.name)) {
				return table.addRow('🔴 Error', '', file, 'Invalid or missing event name.');
			}

			if (event.once) {
				client.once(event.name, (...args) => event.execute(...args, client));
			}
			else {
				client.on(event.name, (...args) => event.execute(...args, client));
			}

			client.events.set(event.name, event);
			return table.addRow('🟢 Registered', event.name, file);
		});

	console.log(table.toString());
};
