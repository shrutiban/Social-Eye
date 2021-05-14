'use strict';

let express = require('express');
let auth = require('../middleware/auth');
const chalk = require('chalk');
let loginRouter = express.Router();
// const {log4jsconfig}=require('../../config/log4jsconfig.ts')
 const log=require('log-to-file')
 // Using __filename as the first argument is recommended.
 // This will set the `file` field in the output to the relative path of the current file.

let loginTriesLimit = 0;

loginRouter.get('/', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/login')));
	res.render('login.ejs');
	log("login reached")
});


loginRouter.post('/', (req, res) => {
	console.log(chalk.cyan('POST ' + chalk.blue('/login')));
	
	if (loginTriesLimit == 3) {
		loginTriesLimit = 0;
		
		res.json({
			success: true
		});
		log("login limit reached");
		return;
	}
	auth.authorize(req.body, (err, result) => {
		if (err) {
			loginTriesLimit++;
			res.json({
				success: false
			});
		} else {
			res.cookie('ngotok', result, {
				httpOnly: true
			});
			res.json({
				success: true,
				token: result
			});
			log("login successful");
		}
	});
});

module.exports = loginRouter;