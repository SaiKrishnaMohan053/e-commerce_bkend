var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dataRouter = require('./routes/data.route');


var app = express();
app.use(bodyParser.json());

var uri = 'mongodb+srv://Saikrishnamohan:AHG1N6eRjUcj3TDe@cluster0.eggzxuh.mongodb.net/?retryWrites=true&w=majority';

app.use('/data', dataRouter);

mongoose.connect(uri)
.then(res => console.log('connected to db'))
.catch(err => console.log(err.message));

app.listen(5588, ()=>{
    console.log('server started at 5588');
})