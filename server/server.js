var mysql = require("mysql");

// var conn = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "101810",
//     database: "myboard",
//     dateStrings: 'date'
// });

conn.connect((err) => {
    if (err) {
        console.error('MySQL 연결 오류:', err);
    } else {
        console.log('MySQL 연결 성공');
    }
});


const express = require('express');
const app = express();

//body-parser라이브러리 추가
const bodyParser = require('body-parser');
const db=require('node-mysql/lib/db');app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(8080, function() {
    console.log("포트 8080 으로 서버 대기중 ...");
});



app.use(express.static('public'));