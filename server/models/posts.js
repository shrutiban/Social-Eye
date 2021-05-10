'use strict';

const mongoose = require('mongoose');
// let auth = require('../middleware/auth');

const postsSchema = mongoose.Schema({
	userId: {
		type: String,
		required: true
	},
	description: {
		type: String,
		max:500
	},
	img: {
		type: String,
	},
    contactInfo:{
        phone:{
            type: Number,
            // max:10,
            required:true
        },
        address:{
            type: String,
            max: 80
        },
        email:{
            type: String,
            required: true
        }
    },
	donate: {
		type: Array,
		default: []
	}

}, 
{
	timestamps: true
});

// managementSchema.pre('save', function(next) {
// 	let derivedKey = auth.generatePassword(this.password);
// 	this.password = derivedKey;
// 	next();
// });

module.exports = mongoose.model('posts', postsSchema);