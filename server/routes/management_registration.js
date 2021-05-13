'use strict';

let express = require('express');
const Management = require('../models/management');
let managementRegRouter = express.Router();
let auth = require('../middleware/auth');
const chalk = require('chalk');

managementRegRouter.get('/', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/management_registration')));
	res.render('management_registration.ejs');
});


managementRegRouter.post('/', (req, res) => {
	console.log(chalk.cyan('POST ' + chalk.blue('/management_registration')));
	let management = new Management({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	});
	management.save((err, result) => {
		if (err) {
			let errorMsg = 'Registration failed! Please contact management';
			if (err.code == 11000 && err.errmsg.includes('username')) errorMsg = 'This username has been already taken';
			else if (err.code = 11000 && err.errmsg.includes('email')) errorMsg = 'This email has been already taken';
			res.json({
				success: false,
				errorMsg: errorMsg
			});
		} else {
			console.log(chalk.yellow('Added management: ' + result.username));
			let token = auth.generateToken(result.username, 'management');
			res.cookie('ngotok', token, {
				httpOnly: true
			});
			res.json({
				success: true
			});
		}
	});
});

module.exports = managementRegRouter;