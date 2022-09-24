const express = require('express');
const path = require('path');
const fs = require('fs');

const Post  = require('../models/post');
const { verifyToken } = require('./middlewares');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
} 

router.post('/', verifyToken, async (req, res, next) => {   // 올바른 토큰인지 확인 하는 거 추가.
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.decoded.id  // 포스트맨 확인하려고 req.decoded.id 를 req.body.id로 바꿈
    });
    res.sendStatus(201)
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put('/:id', verifyToken, async( req, res ) => {
  try {
    console.log(req.decoded.id)
      const updatingPostId = req.params.id
      const oldPost = await Post.findOne({ where : { id: updatingPostId }});
      // 4.  로그인 된 유저와 수정하려는 글의 작성 유저가 같아야 한다 
      if(oldPost.UserId === req.decoded.id) { // 포스트맨 확인하려고 req.decoded.id 를 req.body.id로 바꿈
          console.error("들어왔니?  " );
          // 로그인 된 유저와 수정하려는 글의 작성 유저가 같아야 한다 
          const updatingPostContent 
              = req.body.content === undefined 
                  ? oldPost.content : req.body.content;
          console.error("들어왔니?  ", updatingPostContent );
      
          const updated = await Post.update(
          {
              // 이게 일치한 경우만 수정한다 { where : { userId: 1, postId: 2 } }
              content: updatingPostContent, 
          }, { where: {id: updatingPostId } }
          ).then( (result) => {
              console.error("결과 출력", result );
              return res.status(204).send()
          }).catch( (error) => {
              // 어떤 에러인지 받아 처리를 추가할 수 있다
              return res.status(500).json({
                  code: 500,
                  message: '서버 에러',
                });
          })

      } else {
          res.status(400).send('작성한 유저가 아닙니다')
      }

  } catch(error) {
      // 어떤 에러인지 받아 처리를 추가할 수 있다
      return res.status(500).json({
          code: 500,
          message: '서버 에러',
        });
  }

});



module.exports = router;