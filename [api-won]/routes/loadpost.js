const express = require('express');
// const path = require('path');
const User = require('../models/user');
const Post  = require('../models/post');
const { verifyToken } = require('./middlewares');

const router = express.Router();


router.get('/', verifyToken, async (req, res, next) => {
    try {
      console.log(req.decoded)
      const posts = await Post.findAll({
        // where:{ id : req.decoded.id}, // 포스트맨 확인하려고 req.decoded.id 를 req.body.id로 바꿈
        order: [['createdAt', 'DESC']],
      });
      res.json({
        posts
      });
    } catch(err) {
      console.log(err);
      next(err);
    }
});

    module.exports = router;