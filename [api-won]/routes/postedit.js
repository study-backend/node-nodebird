const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken } = require('./middlewares');
const Post  = require('../models/post');

const router = express.Router();

router.put('/posts/:id', verifyToken, async( req, res ) => {
    try {
        const updatingPostId = req.params.id
        const oldPost = await Post.findOne({ where : { id: updatingPostId }});
        // 4.  로그인 된 유저와 수정하려는 글의 작성 유저가 같아야 한다 
        // const isSuccess = checkUserId(){

        // }
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