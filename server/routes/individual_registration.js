'use strict';

let express = require('express');
const Individual = require('../models/person');
let individualRegRouter = express.Router();
let auth = require('../middleware/auth');
const chalk = require('chalk');

const log=require('log-to-file')


individualRegRouter.get('/', (req, res) => {
	log("person dashboard");

	console.log(chalk.green('GET ' + chalk.blue('/individual_registration')));
	res.render('individual_registration.ejs');
});


individualRegRouter.post('/', (req, res) => {
	console.log(chalk.cyan('POST ' + chalk.blue('/individual_registration')));
	let individual = new Individual({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	});
	individual.save((err, result) => {
		if (err) {

			let errorMsg = 'Registration failed! Please contact management';
			log('Registration failed!');
			if (err.code == 11000 && err.errmsg.includes('username')) errorMsg = 'This username has been already taken';
			else if (err.code = 11000 && err.errmsg.includes('email')) errorMsg = 'This email has been already taken';
			res.json({
				success: false,
				errorMsg: errorMsg
			});
		} else {
			log("Added individual");
			console.log(chalk.yellow('Added individual: ' + result.username));
			let token = auth.generateToken(result.username, 'individual');
			res.cookie('ngotok', token, {
				httpOnly: true
			});
			res.json({
				success: true
			});
		}
	});
});

module.exports = individualRegRouter;