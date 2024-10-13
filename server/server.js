const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require("./router/index");
const server = express();
const port = 8085;

server.use(bodyParser.json());
server.use(cors({
    origin: '*',
    credentials: true,
    methods: ['DELETE', 'GET', 'POST', 'PUT']
}));
server.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

server.use(router);

server.listen(port, (err) => {
    if (!err) {
        console.log(`http://localhost:${port} server is runing!`);
    } else {
        console.log(err.message);
    }
})

process.on('uncaughtException', (err) => {
    console.log('Caught Exception:' + err)
})