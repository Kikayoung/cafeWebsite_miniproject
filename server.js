var mysql = require("mysql");
var express = require('express');
var bodyParser = require('body-parser');
var sha = require('sha256');
let cookieParser = require('cookie-parser');
let session = require('express-session');
const multer = require('multer');
const path = require('path');

//파일의 upload를 처리하는 미들웨어
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

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
    password: "1234",
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

//app.use(express.static('public'));
// 정적 파일 서빙 설정
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser('ncvka0e398423kpfd'));
app.use(session({
    secret: 'dkufe8938493j4e08349u',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
// EJS 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.listen(8080, function() {
    console.log("포트 8080으로 서버 대기 중...");
});
app.use((req, res, next) => {
    res.locals.loggedIn = req.session.loggedIn || false;
    res.locals.user = req.session.user || null;
    next();
});

app.get(['/','/index'], (req, res) => {
    res.render('index', { user: req.session.user, loggedIn: req.session.loggedIn });
});

app.get("/login", function(req, res) {
    if (req.session.user) {
        res.redirect('/index');
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
                req.session.loggedIn = true;
                req.session.userid = userid;
                req.session.user = results[0];
                console.log("새로운 로그인");
                res.redirect('/index');
            } else {
                res.render('login.ejs', {error: '아이디 혹은 비밀번호가 틀렸습니다.'});
            }
        });
    } else {
        res.render('login.ejs', {error: '아이디와 비밀번호를 입력하세요!'});
    }
});

app.get("/logout", function(req, res) {
    console.log("로그아웃");
    req.session.destroy();
    res.redirect("/index");
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
            res.redirect('/login');
        });
    } else {
        res.render('signup.ejs', {error: '모든 항목을 입력하세요!'});
    }
});


app.get('/inquiry_form', (req, res) => {
    res.render('inquiry_form');
});


app.post('/submit-inquiry', upload.single('file_attachment'), (req, res) => {
    const { name, phone, emailId, emailDomain, inquiry_category, subject, content } = req.body;
    const privacy_agreement = req.body.privacy_agreement === 'on' ? 1 : 0;
    const isPrivacyAgreement = privacy_agreement === 1; 

    let email = '';
    if (emailDomain === 'direct') {
        email = `${emailId}@${req.body.directDomain}`;
    } else {
        email = `${emailId}@${emailDomain}`;
    }

    const file_attachment = req.file ? req.file.filename : null;

    const query = `INSERT INTO inquiries (name, phone, email, privacy_agreement, inquiry_category, subject, content, file_attachment) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    conn.query(query, [name, phone, email, isPrivacyAgreement, inquiry_category, subject, content, file_attachment], (err, result) => {
        if (err) {
            console.error('데이터 삽입 오류:', err);
            res.status(500).render('inquiry_form', { error: '문의 제출에 실패하였습니다.', success: null });
        } else {
            res.render('inquiry_form', { error: null, success: '문의가 성공적으로 제출되었습니다.' });
        }
    });
            
});

app.get("/about", function(req, res) {
    res.render("about.ejs");
});
app.get("/profile", function(req, res) {
    res.render("profile.ejs");
});


// ENUM 값 변환 함수
// const getCategoryName = (category) => {
//     const categories = {
//         'order_payment_confirmation': '주문 및 결제 확인',
//         'delivery_inquiry': '배송 문의',
//         'cancellation_return_exchange_refund': '취소/반품/교환/환불',
//         'other': '기타'
//     };
//     return categories[category] || category;
// };

app.get('/FAQlist', (req, res) => {
    const query = `
        SELECT id, subject AS title, inquiry_category, SUBSTRING(content, 1, 100) AS content_preview, created_at AS created
        FROM inquiries`;
        conn.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Server Error');
        }

        // results.forEach(result => {
        //     result.category = getCategoryName(result.inquiry_category);
        // });

        res.render('FAQlist', { data: results });
    });
});

app.get("/shop", function(req, res) {
    res.render("shop.ejs");
});
app.get("/cart", function(req, res) {
    res.render("cart.ejs");
});
