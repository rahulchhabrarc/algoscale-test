"use strict";
let express = require('express')
let bodyParser = require('body-parser')
let vm = require('v-response')
let mongoose = require('mongoose')
let config = require('config')

let message_route = require('./src/api/messages/message.route');

const port = process.env.PORT || config.get("app.port");
const prefix = config.get("api.prefix");
const DB=config.get("database.DB")
const DB_HOST=config.get("database.DB_HOST")
const connect_db = 'mongodb://'+DB_HOST+'/'+DB;

const app = express();

app.use(function (req, res, next) {
res.header("Access-Control-Allow-Origin", "*");
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization,x-api-key");
next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(prefix, message_route);





app.use((err, req, res, next) => {
if (err instanceof SyntaxError)
return res.status(400)
.json(vm.ApiResponse(false, 400, "Request is not valid json!"));
});

mongoose.connect(connect_db,{useUnifiedTopology: true, useNewUrlParser: true } )
.then(() => vm.log("connected to mongoDB", connect_db))
.catch(err => vm.log("error mongodb", err));
const apiserver =app.listen(port, vm.log("listing on port", port));
apiserver.timeout = 3600000;


