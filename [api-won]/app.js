// 라이브러리 선언
const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const path = require('path')
const session = require('express-session')
const dotenv = require('dotenv')
// const passport = require('passport')
const { sequelize } = require('./models')

dotenv.config();

// 라우터 연결

const likeRouter = require('./routes/like')
const followRouter = require('./routes/follow')
const erasePostRouter = require('./routes/erasepost')
const loadPostRouter = require('./routes/loadpost')
const withdrawalRouter = require('./routes/Withdrawal')
const userEditRouter = require('./routes/useredit')
const loginRouter = require('./routes/login')
const joinRouter = require('./routes/join')
const postRouter = require('./routes/post')

const passportConfig = require('./passport')

const app = express()

// passportConfig()
app.set('port', process.env.PORT)

sequelize.sync({ force: false })
.then(() => {
    console.log('데이터베이스 연결 성공')
})
.catch((err) => {
    console.log(err)
})


// 미들웨어
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/img', express.static(path.join(__dirname, 'uploads')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

// app.use(passport.initialize());
// app.use(passport.session());


// 라우터 미들웨어 등록

app.use('/join', joinRouter);
app.use('/login', loginRouter);
app.use('/posts', postRouter);
app.use('/edit', userEditRouter);
app.use('/withdrawal', withdrawalRouter);
app.use('/loadpost', loadPostRouter);
app.use('/erasepost', erasePostRouter);
app.use('/follow', followRouter);
app.use('/like', likeRouter)


app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
    });