var express=require('express'),
connect=require('connect');
path=require('path'),
tableGenerator=require("./routes/tableGenerator.js");

var app=express();
	app.set('view engine', 'jade');
	app.set('views', __dirname+'/views');
	app.use(express.static(path.join(__dirname, 'public')));
	


app.get('/', tableGenerator.tableWizard);
app.get('/:columns/:rows', tableGenerator.generate);
app.listen(3000);
