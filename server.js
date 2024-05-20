var mysql = require("mysql");
var express = require('express');
var bodyParser = require('body-parser');
var sha = require('sha256');
let cookieParser = require('cookie-parser');
let session = require('express-session');


// var conn = mysql.createConnection({
//     host: "210.117.212.134",
//     user: "guro",
//     password: "1234",
//     database: "test",
//     dateStrings: 'date'
// });

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "guro1234",
    database: "godiva",
    dateStrings: 'date'
});

conn.connect((err) => {
    if (err) {
        console.error('MySQL 연결 오류:', err);
    } else {
        console.log('MySQL 연결 성공');
    }
});

const app = express();

app.use(cookieParser('ncvka0e398423kpfd'));
app.use(session({
    secret: 'dkufe8938493j4e08349u',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.listen(8080, function() {
    console.log("포트 8080으로 서버 대기 중...");
});

app.get('/', function(req, res) {
    res.render('index', { user: req.user });
});

app.get("/index", function(req, res) {
    res.render("index.ejs", { user: req.session.user });
});

app.get("/login", function(req, res) {
    if (req.session.user) {
        res.render('index.ejs', { user: req.session.user });

    } else {
        res.render("login.ejs");
    }
});


app.post('/login', (req, res) => {
    console.log("아이디 : "+req.body.userid);
    console.log("비밀번호 : "+req.body.userpw);

    const userid = req.body.userid;
    const userpw = req.body.userpw;

    if (userid && userpw) {
        let sql = "SELECT * FROM account WHERE userid = ? AND userpw = ?";
        conn.query(sql, [userid, userpw], (err, results, fields) => {
            if (err) {
                res.send('데이터베이스 오류 발생: ' + err.message);
                return;
            }

            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.userid = userid;
                req.session.user = results[0];
                console.log("새로운 로그인");
                res.render("index.ejs",{user:req.session.user}); 
            } else {
                res.render('login.ejs');
            }
        });
    } else {
        //res.send('아이디와 비밀번호를 입력하세요!');
        res.render('login.ejs');
    }
});

app.get("/logout", function(req, res) {
    console.log("로그아웃");
    req.session.destroy();
    res.redirect("/");
});

app.get("/signup", function(req, res) {
    res.render("signup.ejs");
});

app.post('/signup', (req, res) => {
    const { userid, userpw, userphonenumber, useremail } = req.body;
    if (userid && userpw && userphonenumber && useremail) {
        let sql = "INSERT INTO account (userid, userpw, userphonenumber, useremail) VALUES (?, ?, ?, ?)";
        conn.query(sql, [userid, userpw, userphonenumber, useremail], (err, results, fields) => {
            if (err) {
                res.send('회원가입 중 오류가 발생했습니다: ' + err.message);
                return;
            }
            res.redirect('/');
        });
    } else {
        
        res.redirect('/');
        //res.send('모든 항목를 입력하세요!');
    }
});

app.get("/about", function(req, res) {
    res.render("about.ejs");
});
app.get("/shop", function(req, res) {
    res.render("shop.ejs");
});
app.get("/cart", function(req, res) {
    res.render("cart.ejs");
});