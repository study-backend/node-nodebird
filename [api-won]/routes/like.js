const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');
const { verifyToken } = require('./middlewares');

const router = express.Router();

router.post('/:id/like-posts',verifyToken, async(req, res, next) => {
    try {
      const user = await User.findOne({ where: { id: req.decoded.id }});// 포스트맨 확인하려고 req.decoded.id 를 req.body.id로 바꿈
      console.log(user);
      await user.addLikePost(parseInt(req.params.id, 10));
      res.send('좋아요 성공!')
    } catch(error) {
      console.error(error);
      next(error);
    }
  })
  
  router.post('/:id/like-cancel', verifyToken, async(req, res, next) => {
    try {
      const user = await User.findOne({ where: { id: req.decoded.id }}); // 포스트맨 확인하려고 req.decoded.id 를 req.body.id로 바꿈
      await user.removeLikePost(parseInt(req.params.id, 10));
      res.send('좋아요 취소!')
    } catch(error) {
      console.error(error);
      next(error);
    }
  })
  

  module.exports = router;