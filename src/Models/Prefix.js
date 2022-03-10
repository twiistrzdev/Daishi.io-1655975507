// ██████ Integrations ████████████████████████████████████████████████████████

// —— A MongoDB object modeling tool designed to work in an asynchronous environment
const { model, Schema } = require('mongoose');
// —— Includes config file
const { prefix } = require('../config.json');

// ██████ | ███████████████████████████████████████████████████████████████████

module.exports = model(
	'Prefix',
	new Schema({
		_guild: { type: String, required: true },
		prefix: { type: String, default: prefix },
	}),
);
