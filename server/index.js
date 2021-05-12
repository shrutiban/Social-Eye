'use strict';

// listing all imports
let express = require('express');
let cookieParser = require('cookie-parser');
let requireDir = require('require-dir');
let routes = requireDir('./routes');
let auth = require('./middleware/auth');
let mongoose = require('mongoose');
const chalk = require('chalk');
require('dotenv').config();

// connect to db
mongoose.connect("mongodb+srv://mongodb:mongodb@cluster0.jo8ol.mongodb.net/testing?retryWrites=true&w=majority",
{
	useNewUrlParser: true
}).then(
	() => console.log(chalk.yellow('Connected to mongo database at anask.xyz')),
	err => console.log(chalk.red(err))
);

// express setup
let app = express();
app.set('port', 5050);
app.use(express.static(__dirname + '/public')); // css and js
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/donation', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/donation')));
	res.status(200).render('donate.ejs');
});

app.get('/', (req, res, next) => {
		if (!req.cookies.ngotok) return next();
		auth.direct(res, next, req.cookies.ngotok);
	},
	(req, res) => {
		console.log(chalk.green('GET ' + chalk.blue('/')));
		res.render('index.ejs');
	});
// app.get('/management_registration', (req, res) => {
// 		console.log(chalk.green('GET ' + chalk.blue('/management_registration')));
// 		// res.clearCookie('ngotok');
// 		res.render('management_registration.ejs');
	// });
for (let route in routes)
	app.use('/' + route, routes[route]);

app.get('/logout', (req, res) => {
	console.log(chalk.green('GET ' + chalk.blue('/logout')));
	res.clearCookie('ngotok');
	res.redirect('/');
});


app.use((req, res, next) => {
	console.log(chalk.yellow('Undefined route: ' + req.method + ' ' + req.originalUrl));
	res.status(404).render('404.ejs');
});


module.exports = app;