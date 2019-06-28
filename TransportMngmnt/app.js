var express = require('express');
const bodyParser= require('body-parser');
var assert = require('assert');
var mysql = require('mysql');
var app = express();
var router = express.Router();
var moment = require('moment');
var sha1 = require('sha1');
require('dotenv').config();
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended: true}));
//app.use(app.router);
app.use(express.static(__dirname + '/'));
app.all("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

var con = mysql.createConnection({
    host: process.env.HOST_NAME,
    user: process.env.USER_NAME1,
    password: process.env.PASSWORD,
    database:process.env.DATABASE_NAME,
    multipleStatements: true
});


app.listen(process.env.PORT,function(){
    console.log('listening on port 3000');
});




app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/register',function(req,res){
    console.log('Register Details');
    console.log(req.body)
    con.query('call register(?,?,?,?,?,?,?)',[req.body.firstname,req.body.lastname,req.body.phone,req.body.email,req.body.username,req.body.password,req.body.usertype] ,function (err, result, fields) {
        if (err) res.status(500).send({message:err.sqlMessage});
        console.log('Register Output:'+result[0]);
        res.status(200).send({message:result});
    });
})
app.get('/login',function(req,res){
    console.log('Login Details:'+req.query)
    con.query('select user_id,status from user_credentials where username = ? and password = ? and status = true',[req.query.username,sha1(req.query.password)] ,function (err, result, fields) {
        if (err) res.status(500).send({message:err.sqlMessage});
        console.log('Login Result'+result);
        res.status(200).send({message:result});
    });
})
app.get('/admin',function(req,res){
    con.query('select user_id,username from user_credentials where status = false',function (err, result, fields) {
        if (err) res.status(500).send({message:err.sqlMessage});
        console.log('Admin Output:'+result);
        res.status(200).send({message:result});
    });
})

app.get('/routes',function(req,res){
    console.log('Get Routes:'+req.query)
    con.query('select route_id,from_loc,to_loc,arrival_time,departure_time,user_id,seats from driver_routes where user_id = ?',[req.query.user_id],function (err, result, fields) {
        if (err) res.status(500).send({message:err.sqlMessage});
        console.log('Routes Output:'+result);
        res.status(200).send({message:result});
    });
})

app.post('/approveuser',function(req,res){
    console.log('Approve user Details:'+req.body);
    con.query('update user_credentials set status = true where user_id = ?',[req.body.user_id],function (err, result, fields) {
        if (err) res.status(500).send({message:err.sqlMessage});
        console.log('Approve user details output:'+result);
        res.status(200).send({message:result});
    });
})


app.post('/routesubmit',function(req,res){
    console.log('Route Submit:'+req.body)
        req.body.departuretime = moment(req.body.departuretime).format("YYYY-MM-DD HH:mm:ss")
        req.body.arrivaltime = moment(req.body.arrivaltime).format("YYYY-MM-DD HH:mm:ss")
    con.query('insert into driver_routes(from_loc,to_loc,arrival_time,departure_time,user_id,seats) values(?,?,?,?,?,?)',[req.body.startingpoint,req.body.destination,req.body.arrivaltime,req.body.departuretime,req.body.user_id,req.body.seats],function (err, result, fields) {
        if (err) res.status(500).send({message:err.sqlMessage});
        console.log('Route Submit Output:'+result);
        res.status(200).send({message:result});
    });
})


app.post('/book',function(req,res){
    console.log('Booking:'+req.body)
    req.body.user_id = parseInt(req.body.user_id)
    req.body.route_id = parseInt(req.body.route_id)
    con.query('call book(?,?)',[req.body.user_id,req.body.route_id],function (err, result, fields) {
        if (err) res.status(500).send({message:err.sqlMessage});
        console.log('booking output:'+result);
        res.status(200).send({message:result});
    });
})

app.get('/getbookings',function(req,res){
    console.log('Get Booking Details:'+req.query)
    con.query('select user_id,route_id,from_loc,to_loc from user_routes where user_id = ?',[req.query.user_id],function (err, result, fields) {
        if (err) res.status(500).send({message:err.sqlMessage});
        console.log('Get booking output:'+result);
        res.status(200).send({message:result});
    });
})
app.get('/allroutes',function(req,res){
    console.log('All routes:'+req.query);
    con.query('select route_id,from_loc,to_loc,arrival_time,departure_time,user_id,seats from driver_routes',function (err, result, fields) {
        if (err) res.status(500).send({message:err.sqlMessage});
        console.log('All routes output:'+result);
        res.status(200).send({message:result});
    });
})

app.get('/getdriverdetails',function(req,res){
    console.log('Driver Details:'+req.query);
    con.query('call driverdetails(?)',[req.query.route_id],function (err, result, fields) {
        if (err) res.status(500).send({message:err.sqlMessage});
        console.log('Driver Details output'+result[0]);
        res.status(200).send({message:result[0]});
    });
})
