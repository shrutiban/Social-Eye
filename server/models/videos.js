'use strict';

const mongoose = require('mongoose');

const videosSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true,
		unique: true
	},
	description: {
		type: String
	},
	postedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'org'
	},
	vidComments: [{
		person: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'person'
		},
		text: {
			type: String
		}
	}]
}, {
	timestamps: true
});

videosSchema.post('remove', function(doc) {
	// remove the video's references from all person documents
});

module.exports = mongoose.model('videos', videosSchema, 'videos');