const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});


router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    console.log(req.user.id, req.query.follwerNick);
    const user = await User.findOne({ where: { id: req.user.id } });
    const deleteFollower = await User.findOne({ where: { nick: req.query.follwerNick }})
    console.log(deleteFollower.id);
    if(user) {
      // delete following
      await deleteFollower.removeFollower(user.id)
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch(error) {
    console.error(error);
    next(error);
  }
})

router.patch('', isLoggedIn, async (req, res, next) => {
  try {
    console.log(req.body.nick, req.user.id)
    //const user1 = await User.findOne({ where: { id: req.user.id } }); 
    const user = await User.update({ nick: req.body.nick }, { where: {id: req.user.id }});
    res.send('success');
  } catch(error) {
    console.error(error);
    next(error);
  }
})

module.exports = router;