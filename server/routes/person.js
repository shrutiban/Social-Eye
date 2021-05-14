'use strict';

let express = require('express');
let auth = require('../middleware/auth');
let personRouter = express.Router();
let Person = require('../models/person');
let Videos = require('../models/videos');
const chalk = require('chalk');
const log=require('log-to-file')


personRouter.use((req, res, next) => {
	auth.authenticate(req, res, next, 'person');
});

personRouter.get('/', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/person')));
	log("person dashboard");
	res.render('person_dashboard.ejs', {
		user: req.user
	});
});

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


let videos = [];


personRouter.get('/videos', async(req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/person/videos')));
	try {
        const video = await Videos.find();
		let videos = [];
		log("posts fetched successfully");
		for (let i = 0; i < video.length; i++) {
					videos.push({
						author: video[i].postedByName,
						name: video[i].name,
						link: video[i].link
					});
				}    
				res.json({
							success: true,
							videos: videos
						});
    } catch (error) {
		log("can not fetch posts");
        res.status(404).json({ message: error.message });
    }
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
			postedByID: person._id,
			postedByName: person.name
		});
		video.save((err, result) => {
			if (err) {
				log("person's post not added");
				console.log(chalk.red(err));
				return res.json({
					success: false
				});
			}
			log("person's post added");
		});
		res.json({
			success: true,
			name: video.name,
			link: video.link
		});
	});
});

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