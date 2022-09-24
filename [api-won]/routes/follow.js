const express = require('express');
const User = require('../models/user');
const { verifyToken } = require('./middlewares');

const router = express.Router();

router.post('/:id/following', verifyToken, async (req, res, next) => {
    try {
      const user = await User.findOne({ where: { id: req.decoded.id } }); // 포스트맨 확인하려고 req.decoded.id 를 req.body.id로 바꿈
      if (user) {
        await user.addFollowing(parseInt(req.params.id, 10));
        res.status(204).send()
      } else {
        res.status(404).send('no user'); 
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

  router.post('/:id/unfollowing', verifyToken, async (req, res, next) => {
    try {
      const user = await User.findOne({ where: { id: req.params.id } });
      if (user) {
        await user.removeFollower(parseInt(req.decoded.id, 10)); // 포스트맨 확인하려고 req.decoded.id 를 req.body.id로 바꿈
        res.send('언팔로우 성공.');
      } else {
        res.status(404).send('no user'); 
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  });

  module.exports = router;