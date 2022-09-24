const express = require('express');
const User = require('../models/user');
const { verifyToken } = require('./middlewares');

const router = express.Router();

router.patch('/', verifyToken, async (req, res, next) => {
    try {
      const updatedCount = await User.update({ nick: req.body.nick }, { where: {id: req.decoded.id }}); // 포스트맨 확인하려고 req.decoded.id 를 req.body.id로 바꿈
      console.log("updatedCount",updatedCount)
      res.json({
        code: 200,
        message: `별명이 수정됐습니다. 바뀐 별명 : ${req.body.nick}`,
      });
    } catch(error) {
      console.error(error);
      next(error);
    }
  })


module.exports = router;