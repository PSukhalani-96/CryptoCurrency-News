var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var session = require('express-session');
var Request = require("request");

// Initialise App
var app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// Setup View Engines
app.engine('handlebars', exphbs({defaultLayout: 'base'}));

// set view engine to handlebars
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended:  true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));

app.get('/', function(req, res){
	
	// Grab CryptoCurrency News
	Request.get("https://min-api.cryptocompare.com/data/v2/news/?lang=EN", (error, response, body) => {
    	if(error) {
    	    return console.dir(error);
    	}
		
		// Grab Price of Cryptocurrency.
		Request.get("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,XRP,BCH,EOS,LTC,XLM,ADA,USDT,MIOTA,TRX&tsyms=USD", (err, resp, content) => {
    		if(err) {
    			return console.dir(err);
    		}
    		var result = JSON.parse(body);
			var data = result.Data;

			var price = JSON.parse(content);
			
			// res.render('home',{api: JSON.stringify(result), price: price});
			res.render('home',{api: result, price: price});

    	});		
	});
});

app.get('/prices', function(req, res){
	res.render('prices');
});

app.post('/prices', function(req, res) {
	
	var str = req.body.quote;
	var result = str.split(' ').join('').toUpperCase();

	Request.get("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=" + result + "&tsyms=USD", (err, resp, content) => {
    if(err) {
    	return console.dir(err);
    }
			
	var data = JSON.parse(content);
		res.render('prices', {quote: result, data: data});
    });	

});


app.set('port', (process.env.PORT || 8000));

app.listen(app.get('port'), function(){
	console.log('Server started on port ' + app.get('port'));	
});