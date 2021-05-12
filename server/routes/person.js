'use strict';

let express = require('express');
let auth = require('../middleware/auth');
let personRouter = express.Router();
let Person = require('../models/person');
let Videos = require('../models/videos');
const chalk = require('chalk');

// authentication middleware
personRouter.use((req, res, next) => {
	auth.authenticate(req, res, next, 'person');
});

/*
	GET /person
	response: view with variables { user (username) }
*/
personRouter.get('/', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/person')));
	res.render('person_dashboard.ejs', {
		user: req.user
	});
});

/*
	GET /person/details
	response: json { success (boolean), name, email, username }
*/
personRouter.get('/details', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/person/details')));
	Person.findOne({
		username: req.user.username
	}, (err, person) => {
		if (err) throw err;
		if (person == null) return res.json({
			success: false
		});
		res.json({
			success: true,
			name: person.name,
			email: person.email,
			username: person.username
		});
	});
});

/*
	GET /person/videos
	response: json { success (boolean), videos { name, link } }
*/


let videos = [];


personRouter.get('/videos', async(req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/person/videos')));
	try {
        const video = await Videos.find();
		let videos = [];
		for (let i = 0; i < video.length; i++) {
					videos.push({
						name: video[i].name,
						link: video[i].link
					});
				}    
				res.json({
							success: true,
							videos: videos
						});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
	// Person.findOne({
	// 	username: req.user.username
	// }).populate('videos').exec((err, person) => {

	// 	if (err) throw err;
	// 	if (person == null) return res.json({
	// 		success: false
	// 	});
	// 	Videos.find({}, function(err, users) {
	// 		// var userMap = {};
	// 		// let videos = [];
	// 		users.forEach(function(user) {
	// 		  person[videos] = user;
	// 		  console.log(user)
	// 			//   videos.push({
	// 			// name: user[i].name,
	// 			// link: user[i].link
	// 			// });
	// 		});
	// 	  });
	// 	// if (!person.videos || person.videos.length == 0) return res.json({
	// 	// 	success: false
	// 	// });
	// 	let videos = [];
	// 	// for (let i = 0; i < person.videos.length; i++) {
	// 	// 	videos.push({
	// 	// 		name: person.videos[i].name,
	// 	// 		link: person.videos[i].link
	// 	// 	});
	// 	// }
	// 	res.json({
	// 		success: true,
	// 		videos: videos
	// 	});
	// });
});
personRouter.get('/myvideos', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/person/myvideos')));
	Videos.find().populate({
		path: 'postedBy',
		match: {
			username: req.user.username
		}
	}).exec((err, videos) => {
		if (err) throw err;
		if (videos == null) return res.json({
			success: false
		});
		let vids = [];
		for (let i = 0; i < videos.length; i++) {
			vids.push({
				name: videos[i].name,
				link: videos[i].link
			});
		}
		res.json({
			success: true,
			videos: vids
		});
	});
});
/*
	GET /person/video/<linkOfVideo>
	response: view with variables { video { name, link, comments } }
*/
personRouter.get('/video/:link', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/person/video')));
	let link = decodeURIComponent(req.params.link);
	Videos.findOne({
		link: link
	}).populate('vidComments.person').exec((err, video) => {
		if (err) throw err;
		if (video == null) return res.render('404.ejs');
		let comments = [];
		for (let i = 0; i < video.vidComments.length; i++) {
			if (video.vidComments[i].person) {
				comments.push({
					username: video.vidComments[i].person.username,
					text: video.vidComments[i].text
				});
			}
		}
		res.render('video.ejs', {
			video: {
				username: req.user.username,
				name: video.name,
				link: video.link,
				comments: comments
			}
		});
	});
});

/*
	POST /person/addComment/<linkOfVideo>
	request body: json { text }
	response: json { success (boolean), username, text }
*/
personRouter.post('/addComment/:link', (req, res) => {
	console.log(chalk.cyan('POST ' + chalk.blue('/person/addComment')));
	let link = decodeURIComponent(req.params.link);
	Person.findOne({
		username: req.user.username
	}, (err, person) => {
		if (err || !person) return res.json({
			success: false
		});
		let comment = {
			person: person,
			text: req.body.text
		};
		Videos.findOneAndUpdate({
			link: link
		}, {
			$push: {
				vidComments: comment
			}
		}, (err, updatedResult) => {
			if (err) return res.json({
				success: false
			});
			res.json({
				success: true,
				username: req.user.username,
				text: req.body.text
			});
		});
	});
});

personRouter.post('/addVideo', (req, res) => {
	console.log(chalk.cyan('POST ' + chalk.blue('/person/addVideo')));
	Person.findOne({
		username: req.user.username
	}).populate('persons').exec((err, person) => {
		if (err) throw err;
		if (person == null) return res.json({
			success: false
		});
		let video = new Videos({
			name: req.body.name,
			link: req.body.link,
			postedBy: person
		});
		video.save((err, result) => {
			if (err) {
				console.log(chalk.red(err));
				return res.json({
					success: false
				});
			}
			// for (let i = 0; i < sorg.persons.length; i++) {
			// 	Person.findOneAndUpdate({
			// 		username: org.persons[i].username
			// 	}, {
			// 		$push: {
			// 			videos: result
			// 		}
			// 	}, (err, updatedPerson) => {
			// 		if (err) throw err;
			// 	});
			// }
		});
		res.json({
			success: true,
			name: video.name,
			link: video.link
		});
	});
});
/*
	POST /person/deleteComment/<linkOfVideo>
	request body: json { text }
	response: json { success (boolean) }
*/
personRouter.post('/deleteComment/:link', (req, res) => {
	console.log(chalk.cyan('POST ' + chalk.blue('/person/deleteComment')));
	let link = decodeURIComponent(req.params.link);
	Videos.findOne({
		link: link
	}).populate('vidComments.person').exec((err, video) => {
		for (let i = 0; i < video.vidComments.length; i++) {
			if (video.vidComments[i].person && video.vidComments[i].person.username == req.user.username && video.vidComments[i].text == req.body.text) {
				video.vidComments.splice(i, 1);
				break;
			}
		}
		video.save((err, result) => {
			if (err) {
				console.log(chalk.red(err));
				res.json({
					success: false
				});
			} else res.json({
				success: true
			});
		});
	});
});

personRouter.post('/deleteVideo', (req, res) => {
	console.log(chalk.cyan('POST ' + chalk.blue('/person/deleteVideo')));
	Videos.deleteOne({
		link: req.body.link
	}, (err) => {
		if (err) {
			console.log(err);
			res.json({
				success: false
			});
		}
		res.json({
			success: true
		});
	});
});
module.exports = personRouter;