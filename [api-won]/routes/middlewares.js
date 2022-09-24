const jwt = require('jsonwebtoken');
const User = require('../models/user');

// const RateLimit = require('express-rate-limit');

// exports.isLoggedIn = (req, res, next) => {
//     if (req.isAuthenticated()) {
//       next();
//     } else {
//       res.status(403).send('로그인 필요');
//     }
//   };
    
//   exports.isNotLoggedIn = (req, res, next) => {
//     if (!req.isAuthenticated()) {
//       next();
//     } else {
//       const message = encodeURIComponent('로그인한 상태입니다.');
//       res.redirect(`/?error=${message}`);
//     }
//   };

exports.verifyToken = async (req, res, next) => {
  try {
    console.log('headers.authorization',req.headers.authorization);
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
    const isUser = await User.findOne({where: {id: req.decoded.id}})
    
    console.log("req.decoded.id",req.decoded.id)
    console.log("isUser",isUser)
    if(isUser.deletedAt !== null){
      return res.status(400).json({
        message: "이미 탈퇴한 유저입니다." 
      })
    }
    return next()
  } 
  catch(error) {
    console.log("error", error)
    
    if(error.name === 'TokenExpiredError') {

      return res.status(419).json({code: 419,message: '토큰이 만료되었습니다',});
    }
    return res.status(401).json({code: 401,message: '유효하지 않은 토큰입니다',})
  }
}

// 오류 수정 : https://www.npmjs.com/package/express-rate-limit
// exports.apiLimiter = RateLimit({
//   windowMs: 60 * 1000, // 1분
//   max: 10,
//   delayMs: 0,
//   handler(req, res) {
//     res.status(this.statusCode).json({
//       code: this.statusCode, // 기본값 429
//       message: '1분에 한 번만 요청할 수 있습니다.',
//     });
//   },
// });

// exports.premiumApiLimiter = RateLimit({
//   windowMs: 60 * 1000, // 1분
//   max: 100,
//   delayMs: 0,
//   handler(req, res) {
//     res.status(this.statusCode).json({
//       code: this.statusCode, // 기본값 429
//       message: '1분에 100번 만 요청할 수 있습니다.',
//     });
//   },
// });

// exports.deprecated = (req, res) => {
//   res.status(410).json({
//     code: 410,
//     message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
//   });
// };