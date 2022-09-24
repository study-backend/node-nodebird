const express = require('express');


const { Post } = require('../models');
const { verifyToken } = require('./middlewares');


const router = express.Router();

router.delete('/:id', verifyToken, async (req, res, next) => {
    try {
      console.log(req.params.id, req.decoded.id) // 포스트맨 확인하려고 req.decoded.id 를 req.body.id로 바꿈
      const post = await Post.findOne({ where: {id: req.params.id }})
      await Post.destroy( {where: {id: req.params.id, UserId: req.decoded.id} }) // 포스트맨 확인하려고 req.decoded.id 를 req.body.id로 바꿈
      res.json({
        message: "게시글이 삭제 됐습니다."
      })
    } catch(error) {
      console.error(error)
      next(error)
    }
  })

  module.exports = router;