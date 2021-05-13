'use strict';

let express = require('express');
let auth = require('../middleware/auth');
let orgRouter = express.Router();
let Org = require('../models/org');
let Videos = require('../models/videos');
let Person = require('../models/person');
const chalk = require('chalk');

orgRouter.use((req, res, next) => {
	auth.authenticate(req, res, next, 'org');
});


orgRouter.get('/', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/org')));
	res.render('org_dashboard.ejs', {
		user: req.user
	});
});


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


let videos = [];


orgRouter.get('/videos', async(req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/org/videos')));
	try {
        const video = await Videos.find();
		let videos = [];
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
        res.status(404).json({ message: error.message });
    }
});


orgRouter.get('/myvideos', async(req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/org/myvideos')));
	try {
        const video = await Videos.find();
		let videos = [];
		for (let i = 0; i < video.length; i++) {
					videos.push({
						author: video[i].postedBy,
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
			postedByID: org._id,
			postedByName: org.name
		});
		video.save((err, result) => {
			if (err) {
				console.log(chalk.red(err));
				return res.json({
					success: false
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