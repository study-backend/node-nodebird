// 1. [express] express 선언
const express = require('express');
// 1. [log] 로깅 선언 
const morgan = require('morgan');
// 1. [web][cookie] 쿠키 파서 선언
const cookieParser = require('cookie-parser');
// 1. [web][session] 세션 사용하기 위해 선언 
const session = require('express-session');
// 1. [env] 외부 설정파일을 사용하기 위해 선언
const dotenv = require('dotenv');
// [express] 파일 경로를 알기 위해 선언
const path = require('path');
// 1. [VIEW] TEMPLATE ENGINE을 사용하기 위해 선언
const nunjucks = require('nunjucks');

// 2. [env] 외부 설정파일을 사용하기 위해 설정
dotenv.config();
// 2. [express] express 설정
const app = express();
// 2. [view] TEMPLATE ENGINE을 설정
nunjucks.configure('views', {
  express: app,
  watch: true,
});
// 2. [log] 로깅 설정
app.use(morgan('dev'));
// 2. [web][cookie] 쿠키 파서 설정
app.use(cookieParser(process.env.COOKIE_SECRET));
// 2. [web][session] 세션 사용하기 위해 설정
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  name: 'session-cookie',
}));

// 3. [express] express port 설정
app.set('port', process.env.PORT || 3000);

// 4. [express][view] express view 설정
app.set('view engine', 'html');

// 5. [express][view] "/" root 라우트 설정
app.use('/', express.static(path.join(__dirname, 'public')));

// 6. [express] json 모듈 사용 설정
app.use(express.json());

// 7. [express] url 주소 인코드 설정
app.use(express.urlencoded({ extended: false }));

// 8. [express] url 주소 라우트 설정 (외부파일 붙이기)
const indexRouter = require('./routes');
const userRouter = require('./routes/user.js');
// 9. [express] 외부파일의 라우트 미들웨어 설정
app.use('/', indexRouter);
app.use('/user', userRouter);

// 10. [express] 404 error 라우트 설정
app.use((req, res, next) => {
  const error =  new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

// 11. [express] 500 error 라우트 설정
app.use((error, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? error : {};
  res.status(error.status || 500);
  res.render('error');
});

// 12. [express] app listen 설정
app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
