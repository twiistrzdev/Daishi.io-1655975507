// ██████ Integrations ████████████████████████████████████████████████████████

// —— A powerful library for interacting with the Discord API
const { Client } = require('discord.js');
// —— A MongoDB object modeling tool designed to work in an asynchronous environment
const mongoose = require('mongoose');
// —— Includes config file
const { presence } = require('../config.json');

// ██████ | ███████████████████████████████████████████████████████████████████

module.exports = {
	name: 'ready',
	once: true,

	/**
     *
     * @param {Client} client
     */
	async execute(client) {
		if (client.user.id === '947579918802362449') {
			client.prefix = ';;';
		}

		// —— Initialize MongoDB
		if (process.env.MONGODB) {
			console.log('\nConnecting to MongoDB server...');

			try {
				await mongoose
					.connect(process.env.MONGODB, {
						useNewUrlParser: true,
						useUnifiedTopology: true,
					})
					.then(() => console.log('Client is now connected to the MongoDB.'));
			}
			catch (error) {
				console.error(error);
			}
		}
		else {
			console.log('\nNo MongoDB credentials found. All schemas and models will not be usable.');
		}

		// —— Set client user presence
		client.user.setPresence({
			activities: [
				{
					name: presence.activities.name,
					type: presence.activities.type,
					url: presence.activities.url || null,
				},
			],
			status: presence.status,
		});

		console.log(`Client initialized —— Node ${process.version}.`);
	},
};
