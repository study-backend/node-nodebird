const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const url = require('url')

const { verifyToken, apiLimiter, premiumApiLimiter } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

router.use(cors({
    credentials: true,
}))

// 임시로 API 기능만 하기 위해 CORS 를 ALL로 열어 둡니다
// router.use(async (req, res, next) => {
//     const domain = await Domain.findOne({
//       where: { host: url.parse(req.get('origin')).host },
//     });
//     if (domain) {
//       cors({
//         origin: req.get('origin'),
//         credentials: true,
//       })(req, res, next);
//     } else {
//       next();
//     }
//   });

// Header 에 Host 설정을 하거나 req.get('origin') 을 가능하게 합니다
// router.use( async (req, res, next) => {

//     console.log(url.parse(req.get('origin')).host);
//     // DB를 통해서 domain 정보를 가져오고
//   const domain = await Domain.findOne({
//       where: { host: url.parse(req.get('origin')).host },
//   });
  
//   // domain 정보에서 유료/무료 사용자에 대한 정책을 분기한다 
//   if(domain.type === 'premium') {
//     console.log("apiLimiter: premiumApiLimiter")
//     premiumApiLimiter(req, res, next);
//   } else {
//     console.log("apiLimiter: free")
//     apiLimiter(req, res, next);
//   }
  
// });

router.post('/token', async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain = await Domain.findOne({
      where: { clientSecret },
      include: {
        model: User,
        attribute: ['nick', 'id'],
      },
    });
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
      });
    }
    const token = jwt.sign({
      id: domain.User.id,
      nick: domain.User.nick,
      host: domain.host
    }, process.env.JWT_SECRET, {
      expiresIn: '30m', // 30분
      issuer: 'nodebird',
    });
    return res.json({
      code: 200,
      message: '토큰이 발급되었습니다',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

router.get('/test', verifyToken, apiLimiter, (req, res) => {
  res.json(req.decoded);
});

router.get('/posts/my', verifyToken, (req, res) => {
  Post.findAll({ where: { userId: req.decoded.id } })
    .then((posts) => {
      console.log(posts);
      res.json({
        code: 200,
        payload: posts,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        code: 500,
        message: '서버 에러',
      });
    });
});

router.get('/posts/hashtag/:title', verifyToken, async (req, res) => {
  try {
    const hashtag = await Hashtag.findOne({ where: { title: req.params.title } });
    if (!hashtag) {
      return res.status(404).json({
        code: 404,
        message: '검색 결과가 없습니다',
      });
    }
    const posts = await hashtag.getPosts();
    return res.json({
      code: 200,
      payload: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: '서버 에러',
    });
  }
});

/**
 * 팔로워와 팔로잉 목록 가져오기
 */
router.get('/users', verifyToken, async (req, res) => {

    await User.findOne({ where: { id: req.decoded.id  },
        include: [{
          model: User,
          attributes: ['id', 'nick'],
          as: 'Followers',
        }, {
          model: User,
          attributes: ['id', 'nick'],
          as: 'Followings'
        }], 
    })
    .then((user) => {
        console.log(user);
        res.json({
          code: 200,
          payload: user,
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({
          code: 500,
          message: '서버 에러',
        });
      });
    
  });

/**
 * 1. 라우터 몸통을 만들기 
 */
router.put('/posts/:id', verifyToken, async( req, res ) => {
    // 2. 내용물 만들기
    try {
        console.error("body: ", req.body);
        // 3. 요청한 값 받아오기
        // 수정하지 않은 값에도 원래 있던 값을 다시 넣어준다?? -> id로 과거 값을 알 수 있어서 패스
        const updatingPostId = req.params.id
        console.error("params: ", req.params.id);
        const oldPost = await Post.findOne({ where : { id: updatingPostId }});
        // 4.  로그인 된 유저와 수정하려는 글의 작성 유저가 같아야 한다 
        if(oldPost.UserId === req.decoded.id) {
            console.error("들어왔니?  " );
            // 로그인 된 유저와 수정하려는 글의 작성 유저가 같아야 한다 
            const updatingPostContent 
                = req.body.content === undefined 
                    ? oldPost.content : req.body.content;
            console.error("들어왔니?  ", updatingPostContent );
            const updatingPostImage 
                = req.body.image === undefined
                    ? oldPost.img : req.body.image;
            console.error("들어왔니?  ", updatingPostImage );
            const updated = await Post.update(
            {
                // 이게 일치한 경우만 수정한다 { where : { userId: 1, postId: 2 } }
                content: updatingPostContent, 
                img: updatingPostImage
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