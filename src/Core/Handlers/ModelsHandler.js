// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client } = require('discord.js');
// —— A MongoDB object modeling tool designed to work in an asynchronous environment
const mongoose = require('mongoose');
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
	const Table = new Ascii('Models Handler');

	Table.setHeading('', 'Name', 'File', 'Message');

	(await promisifyGlob(`${process.cwd()}/src/Models/**/*.js`))
		.map(async (modelFile) => {
			const model = require(modelFile);
			const file = path.parse(modelFile).base;

			if (!model.modelName) {
				return Table.addRow('🔴', '', file, 'Missing model name.');
			}

			return Table.addRow('🟢', model.modelName, file);
		});

	if (Table.__rows.length) console.log(Table.toString());
};
