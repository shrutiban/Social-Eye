'use strict';

const mongoose = require('mongoose');
let auth = require('../middleware/auth');

const orgSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	// students: [{
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'student'
	// }]
}, {
	timestamps: true
});

orgSchema.pre('save', function(next) {
	let derivedKey = auth.generatePassword(this.password);
	this.password = derivedKey;
	next();
});

orgSchema.post('deleteOne', function(doc) {
	// need to remove videos posted by the org
});

module.exports = mongoose.model('org', orgSchema, 'org');