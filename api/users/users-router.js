const express = require('express');
const { logger, validateUserId, validatePost, validateUser } = require('../middleware/middleware');
const User = require('./users-model');
const Post = require('../posts/posts-model');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();
const errHandler = (res, err) => {
  return res.status(500).json({ error: err.message })
}

router.get('/', logger, async (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try {
    const users = await User.get();
    res.status(200).json(users)
  } catch(err) {
    errHandler(res, err)
  }
});

router.get('/:id', validateUserId, async (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  try {
    res.status(200).json(req.user)
  } catch(err) {
     errHandler(res, err)
  }
});

router.post('/', validateUser, async (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  try {
    const user = req.body;
    const added = await User.insert(user)
    res.status(201).json(added)
  } catch(error) {
     errHandler(res, error)
  }
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const { id } = req.params;
    const changes = req.body;
    const updated = await User.update(id, changes);
    res.status(200).json(updated)
  } catch(err) {
    errHandler(res, err);
  }
});

router.delete('/:id', validateUserId, async (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try {
    const { id } = req.params;
    const userToDelete = await User.getById(id)
    await User.remove(id)
    res.status(200).json(userToDelete)
  } catch(err) {
    errHandler(res, err)
  }
});

router.get('/:id/posts', validateUserId, async (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try {
    const { id } = req.params;
    const userPosts = await User.getUserPosts(id)
    res.status(200).json(userPosts)
  } catch(err) {
    errHandler(res, err)
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const { id } = req.params;
    const post = req.body;
    const added = await Post.insert({...post, user_id: id });
   
    res.status(201).json(added)
  } catch(err) {
    errHandler(res, err)
  }
});

// do not forget to export the router
module.exports = router;