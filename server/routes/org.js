'use strict';

let express = require('express');
let auth = require('../middleware/auth');
let orgRouter = express.Router();
let Org = require('../models/org');
let Videos = require('../models/videos');
let Person = require('../models/person');
const chalk = require('chalk');

// authentication middleware
orgRouter.use((req, res, next) => {
	auth.authenticate(req, res, next, 'org');
});

/*
	GET /org
	response: view with variables { user (username) }
*/
orgRouter.get('/', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/org')));
	res.render('org_dashboard.ejs', {
		user: req.user
	});
});

/*
	GET /org/details
	response: json { success (boolean), name, email, username }
*/
orgRouter.get('/details', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/org/details')));
	Org.findOne({
		username: req.user.username
	}, (err, org) => {
		if (err) throw err;
		if (org == null) return res.json({
			success: false
		});
		res.json({
			success: true,
			name: org.name,
			email: org.email,
			username: org.username
		});
	});
});

/*
	GET /org/videos
	response: json { success (boolean), videos { name, link } }
*/
let videos = [];


orgRouter.get('/videos', async(req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/org/videos')));
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
});
orgRouter.get('/videos', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/org/videos')));
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
	GET /org/video/<linkOfVideo>
	response: view with variables { video { name, link, comments } }
*/
orgRouter.get('/video/:link', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/org/video')));
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
				name: video.name,
				link: video.link,
				comments: comments
			}
		});
	});
});

/*
	POST /org/addVideo
	request body: json { name, link }
	response: json { success (boolean), name, link }
*/
orgRouter.post('/addVideo', (req, res) => {
	console.log(chalk.cyan('POST ' + chalk.blue('/org/addVideo')));
	Org.findOne({
		username: req.user.username
	}).populate('persons').exec((err, org) => {
		if (err) throw err;
		if (org == null) return res.json({
			success: false
		});
		let video = new Videos({
			name: req.body.name,
			link: req.body.link,
			postedBy: org
		});
		video.save((err, result) => {
			if (err) {
				console.log(chalk.red(err));
				return res.json({
					success: false
				});
			}
			for (let i = 0; i < org.persons.length; i++) {
				Person.findOneAndUpdate({
					username: org.persons[i].username
				}, {
					$push: {
						videos: result
					}
				}, (err, updatedPerson) => {
					if (err) throw err;
				});
			}
		});
		res.json({
			success: true,
			name: video.name,
			link: video.link
		});
	});
});
// orgRouter.post('/addComment/:link', (req, res) => {
// 	console.log(chalk.cyan('POST ' + chalk.blue('/org/addComment')));
// 	let link = decodeURIComponent(req.params.link);
// 	Org.findOne({
// 		username: req.user.username
// 	}, (err, org) => {
// 		if (err || !org) return res.json({
// 			success: false
// 		});
// 		let comment = {
// 			org: org,
// 			text: req.body.text
// 		};
// 		Videos.findOneAndUpdate({
// 			link: link
// 		}, {
// 			$push: {
// 				vidComments: comment
// 			}
// 		}, (err, updatedResult) => {
// 			if (err) return res.json({
// 				success: false
// 			});
// 			res.json({
// 				success: true,
// 				username: req.user.username,
// 				text: req.body.text
// 			});
// 		});
// 	});
// });

// orgRouter.post('/deleteComment/:link', (req, res) => {
// 	console.log(chalk.cyan('POST ' + chalk.blue('/org/deleteComment')));
// 	let link = decodeURIComponent(req.params.link);
// 	Videos.findOne({
// 		link: link
// 	}).populate('vidComments.org').exec((err, video) => {
// 		for (let i = 0; i < video.vidComments.length; i++) {
// 			if (video.vidComments[i].person && video.vidComments[i].person.username == req.user.username && video.vidComments[i].text == req.body.text) {
// 				video.vidComments.splice(i, 1);
// 				break;
// 			}
// 		}
// 		video.save((err, result) => {
// 			if (err) {
// 				console.log(chalk.red(err));
// 				res.json({
// 					success: false
// 				});
// 			} else res.json({
// 				success: true
// 			});
// 		});
// 	});
// });

/*
	POST /org/deleteVideo
	request body: json { link }
	response: json { success (boolean) }
*/
orgRouter.post('/deleteVideo', (req, res) => {
	console.log(chalk.cyan('POST ' + chalk.blue('/org/deleteVideo')));
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

module.exports = orgRouter;