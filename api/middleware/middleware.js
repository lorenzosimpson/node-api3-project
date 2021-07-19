var url = require('url');
const User = require('../users/users-model');

function fullUrl(req) {
  return url.format({
    protocol: req.protocol,
    host: req.get('host'),
    pathname: req.originalUrl
  });
}

function logger(req, res, next) {
  console.log(
    "========= LOGGER ==========\n",
    req.method + "\n",
    fullUrl(req) + "\n",
    new Date() + "\n",
    "============================="
  )
  next();
}

async function validateUserId(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.getById(id);
    req.user = user;
    if (user) {
    next();
    } else {
      res.status(404).json({ message: "user not found"})
    }
  } catch(err) {
    res.status(500).json({ error: err.message })
  }
}

function validateUser(req, res, next) {
  if (req.body.name === undefined) {
    res.status(400).json({ message: "missing required name field" })
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (req.body.text === undefined) {
    res.status(400).json({ message: "missing required text field" })
  } else {
    next();
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}