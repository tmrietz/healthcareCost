var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

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

app.post('/localQuery', function(req, res){
	// Test data
	var sampleProcedures = {
		procedure1: {
			name: "kneeSurgery",
			cost: 10000
		},
		procedure2: {
			name: "coldCheckup",
			cost: 10
		}
	};
	var context = {};
	for (var procedure in sampleProcedures) {
		if (req.body.procedure == sampleProcedures[procedure].name) {
			context.cost = sampleProcedures[procedure].cost;
			context.name = sampleProcedures[procedure].name;
		}
	}
	res.render('queryResults', context);
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
