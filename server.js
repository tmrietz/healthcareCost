var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var helpers = require('./helpers.js')

var app = express();
app.set('port', 8913);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


app.get('/', function(req,res){
    res.render('landing');
});


app.get('/submission', function(req,res){
	var context = {};
	res.render('submission', context);
});


app.post('/submitted', function(req,res){
	var context = {};
	context.cost = req.body.cost;
	context.history = req.body.history;
	context.provider = req.body.provider;
	context.location = req.body.location;
	context.procedure = req.body.procedure;
	context.plan = req.body.insuranceplan;
	context.dob = req.body.dob;
	context.date = req.body.date;
	if(res.statusCode>=200 && res.statusCode<400){
		context.message = "Submitted successfully!";
	} else {
		context.message = "Failed to submit, try again.";
	}

	//res.send(context);
	res.render('submitted', context);
});


app.post('/localQuery', function(req, res){
	// Test data
	var sampleProcedures = {
		procedure1: {
			name: "knee Surgery",
			cost: 10000
		},
		procedure2: {
			name: "cold Checkup",
			cost: 10
		},
		procedure3: {
			name: "brain transplant",
			cost: 9999999999
		},
		procedure4: {
			name: "upper endoscopy",
			cost: 50000
		}
	};
	var context = {};
	for (var procedure in sampleProcedures) {
		if (req.body.procedure.toUpperCase() == sampleProcedures[procedure].name.toUpperCase()) {
			context.cost = sampleProcedures[procedure].cost;
			context.name = sampleProcedures[procedure].name;
		}
	}
	res.render('queryResults', context);
});

app.get('/create_account', function(req,res){
	var context = {};
	res.render('create_account', context);
});


app.post('/created', function(req,res){
	var context = {};
	context.fname = req.body.fname;
	context.lname = req.body.lname;
	context.email = req.body.email;
	context.state = req.body.state;
	context.zip = req.body.zip;
	context.bday = req.body.bday;
	context.insurance = req.body.insurance;
	context.username = req.body.username;
	if(res.statusCode>=200 && res.statusCode<400){
		if (helpers.email_valid(context.email)) {
			context.header = "Creation Successful!";
			context.message = "Your username is: ";
			context.message2 = "Your registerd email is: "

		}
		else {
			context.header = "Invalid email";
			context.message = "Please go back and try again."
			context.username = null;
			context.email = null;
		}
		;
	} else {
		context.header = "Something went wrong.";
	}
	res.render('created', context);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip1.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});

// app.listen(3000,'localhost');
