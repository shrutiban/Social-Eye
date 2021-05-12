'use strict';

let express = require('express');
let auth = require('../middleware/auth');
let individualRouter = express.Router();
let Individual = require('../models/individual');
let Posts = require('../models/posts');
const chalk = require('chalk');

// authentication middleware
individualRouter.use((req, res, next) => {
	auth.authenticate(req, res, next, 'individual');
});

/*
	GET /individual
	response: view with variables { user (username) }
*/
individualRouter.get('/', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/individual')));
	res.render('individualHome.ejs', {
		user: req.user
	});
});

/*
	GET /individual/details
	response: json { success (boolean), name, email, username }
*/
individualRouter.get('/details', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/individual/details')));
	Individual.findOne({
		username: req.user.username
	}, (err, individual) => {
		if (err) throw err;
		if (individual == null) return res.json({
			success: false
		});
		res.json({
			success: true,
			name: individual.name,
			email: individual.email,
			username: individual.username
			// classPref: individual.classPref,
			// subjectPref: individual.subjectPref,
			// daysPref: individual.daysPref
		});
	});
});
individualRouter.get('/timeline/all', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('individual/timeline/all')));
	if (req.params.type == "all") {
		Posts.find().populate('individualsOpted').exec((err, schedules) => {
			if (err) throw err;
			let finalSchedules = [];
			schedules.forEach((schedule) => {
				// let optedFor = false;
				// for (let i = 0; i < schedule.length; i++) {
				// 	if (schedule.individualsOpted[i].username == req.user.username) {
				// 		optedFor = true;
				// 		break;
				// 	}
				// }
				let sched = schedule.toObject();
				delete sched.individualsOpted;
				sched.optedFor = optedFor;
				finalSchedules.push(sched);
			});
			res.json(finalSchedules);
		});
	} else if (req.params.type == "preferred") {
		Individual.findOne({
			username: req.user.username
		}, (err, individual) => {
			if (err || !individual) throw err;
			Schedule.find({
				class: individual.classPref,
				subject: individual.subjectPref,
				days: individual.daysPref
			}, (err, schedules) => {
				if (err) throw err;
				let finalSchedules = [];
				schedules.forEach((schedule) => {
					let optedFor = false;
					for (let i = 0; i < schedule.individualsOpted.length; i++) {
						if (schedule.individualsOpted[i].username == req.user.username) {
							optedFor = true;
							break;
						}
					}
					let sched = schedule.toObject();
					delete sched.individualsOpted;
					sched.optedFor = optedFor;
					finalSchedules.push(sched);
				});
				res.json(finalSchedules);
			});
		});
	}
});

/*
	GET /individual/schedules/all, /individual/schedules/preferred
	response: json { name, workDescription, class, days, subject, optedFor }
*/

// individualRouter.get('/schedules/:type', (req, res) => {
// 	console.log(chalk.green('GET ' + chalk.blue('/individual/schedules')));
// 	if (req.params.type == "all") {
// 		Schedule.find().populate('individualsOpted').exec((err, schedules) => {
// 			if (err) throw err;
// 			let finalSchedules = [];
// 			schedules.forEach((schedule) => {
// 				let optedFor = false;
// 				for (let i = 0; i < schedule.individualsOpted.length; i++) {
// 					if (schedule.individualsOpted[i].username == req.user.username) {
// 						optedFor = true;
// 						break;
// 					}
// 				}
// 				let sched = schedule.toObject();
// 				delete sched.individualsOpted;
// 				sched.optedFor = optedFor;
// 				finalSchedules.push(sched);
// 			});
// 			res.json(finalSchedules);
// 		});
// 	} else if (req.params.type == "preferred") {
// 		Individual.findOne({
// 			username: req.user.username
// 		}, (err, individual) => {
// 			if (err || !individual) throw err;
// 			Schedule.find({
// 				class: individual.classPref,
// 				subject: individual.subjectPref,
// 				days: individual.daysPref
// 			}, (err, schedules) => {
// 				if (err) throw err;
// 				let finalSchedules = [];
// 				schedules.forEach((schedule) => {
// 					let optedFor = false;
// 					for (let i = 0; i < schedule.individualsOpted.length; i++) {
// 						if (schedule.individualsOpted[i].username == req.user.username) {
// 							optedFor = true;
// 							break;
// 						}
// 					}
// 					let sched = schedule.toObject();
// 					delete sched.individualsOpted;
// 					sched.optedFor = optedFor;
// 					finalSchedules.push(sched);
// 				});
// 				res.json(finalSchedules);
// 			});
// 		});
// 	}
// });

/*
	POST /individual/schedule/opt, /individual/schedule/deopt
	request body: json { name }
	response: json { success (boolean) }
*/
// individualRouter.post('/schedule/:option', (req, res) => {
// 	console.log(chalk.cyan('POST ' + chalk.blue('/individual/schedule')));
// 	let option = req.params.option;
// 	if (option == 'opt') {
// 		Individual.findOne({
// 			username: req.user.username
// 		}, (err, individual) => {
// 			if (err) throw err;
// 			Schedule.findOneAndUpdate({
// 				name: req.body.name
// 			}, {
// 				$addToSet: {
// 					individualsOpted: individual
// 				}
// 			}, (err, updatedSchedule) => {
// 				if (err) {
// 					console.log(chalk.red(err));
// 					return res.json({
// 						success: false
// 					});
// 				}
// 				res.json({
// 					success: true
// 				});
// 			});
// 		});
// 	} else if (option == 'deopt') {
// 		Schedule.findOne({
// 			name: req.body.name
// 		}).populate('individualsOpted').exec((err, schedule) => {
// 			for (let i = 0; i < schedule.individualsOpted.length; i++) {
// 				if (schedule.individualsOpted[i].username == req.user.username) {
// 					schedule.individualsOpted.splice(i, 1);
// 					break;
// 				}
// 			}
// 			schedule.save((err, result) => {
// 				if (err) {
// 					console.log(chalk.red(err));
// 					return res.json({
// 						success: false
// 					});
// 				}
// 				res.json({
// 					success: true
// 				});
// 			});
// 		});
// 	} else {
// 		res.json({
// 			success: false
// 		});
// 	}
// });

module.exports = individualRouter;