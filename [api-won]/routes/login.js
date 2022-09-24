const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
      const { email, password } = req.body;  // 입력받은 이메일과 비밀번호가 담겨 있음.
      const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).send(' 회원정보를 확인해주세요')
    }
    const hash =  await bcrypt.compare(password, user.password);
    if(hash){
    const token = jwt.sign({
      email,
      id: user.id,
    }, process.env.JWT_SECRET, {
      expiresIn: '3000m', // 30분
      issuer: 'nodebird',
    });
    console.log(token);
    return res.status(200).json({
      message: '토큰이 발급되었습니다',
      token,
    });
  }else{
    res.status(403).send('로그인 정보를 확인해주세요!');
  }
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// router.post('/login', isNotLoggedIn, (req, res, next) => {
//   passport.authenticate('local', (authError, user, info) => {
//     if (authError) {
//       console.error(authError);
//       return next(authError);
//     }
//     if (!user) {
//         res.status(403).send('로그인에 실패했습니다.');
//     }
//     return req.login(user, (loginError) => {
//       if (loginError) {
//         console.error(loginError);
//         return next(loginError);
//       }
//       return res.redirect('/');
//     });
//   })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
// });







module.exports = router;