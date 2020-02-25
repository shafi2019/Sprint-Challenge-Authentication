const router = require('express').Router();
const encrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const { JWTSecret } = require('../secret');
const users = require('../users/users-model');


router.post('/register', (req, res) => {
  let user = req.body;

  // Hashing user password passed into request body
  
  const hash = encrypt.hashSync(user.password, 10)
  user.password = hash;

  // Adding user to DB using "add" helper function
  
  users.add(user)
  .then(addedUser => {
    res.status(201).json(addedUser);
  })
  .catch(error => {
    console.log(error)
    res.status(500).json(error);
  })
});


router.post('/login', (req, res) => {
  let {username, password } = req.body;

  users.findBy({ username })
  .first()
  .then(user => {
    if (user && encrypt.compareSync(password, user.password)) {
      const token = signToken(user);
      console.log(token)
      res.status(200).json({
        Message: "Hello, I am your token!",
        token
      });
    }
    else {
      res.status(401).json({
        Error: 'Invalid credentials!'
      })
    }
  })
  .catch(error => {
    res.status(500).json(error)
  });
});

function signToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: '1d'
  };
  return JWT.sign(payload, JWTSecret, options);
}

module.exports = router;