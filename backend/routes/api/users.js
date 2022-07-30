const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

//express validator imports
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


// GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');

router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    // attributes: { exclude: ['isHost', 'createdAt', 'updatedAt'] },
    where: {
      email: 'amytan@gmail.com'
    },

  });
  setTokenCookie(res, user);
  return res.json({ user });
});


// GET /api/restore-user
const { restoreUser } = require('../../utils/auth.js');
router.get('/restore-user', restoreUser, (req, res) => {
  return res.json(req.user);
}
);

// GET CURRENT USER
// GET /api/require-auth
// const { requireAuth } = require('../../utils/auth.js');
router.get('/me',restoreUser, requireAuth, (req, res) => {

  const { id, firstname, lastname, email } = req.user;

  res.status(200);
  return res.json({
    id,
    firstname,
    lastname,
    email
  });
}
);

// LOGS IN USER
const validateLogin = [
  check('email')
    .exists({ checkFalsy: true })
    .withMessage("Email is required"),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage("Password is required"),
  handleValidationErrors
];


// LOG IN USER
router.post('/login', validateLogin,
  async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.login({ email, password });

    if (!user) {
      const err = new Error("Invalid credentials");
      err.message = "Invalid credentials";
      err.status = 401;
      err.errors = ['The provided credentials were invalid.'];

      return next(err);

    }

   const cookies = await setTokenCookie(res, user);

    res.status(200)
    return res.json({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token: cookies
    });
  }
);


//express validator //this only tests the inputs
const validateSignup = [
  check('firstname')
    .exists({ checkFalsy: true })
    .withMessage("First Name is required"),
  check('lastname')
    .exists({ checkFalsy: true })
    .withMessage("Last Name is required"),
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// SIGN UP
router.post('/signup', validateSignup, async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  const isDuplicateEmail = await User.findOne(
    {
      where: {
        email
      }
    }
  );

  if (isDuplicateEmail) {
    res.status(403)
    const err = new Error('User already exists');
    err.message = 'User already exists';
    err.status = 403;
    err.errors = ['User with that email already exists'];

    return next(err);


  } else {

    const user = await User.signup({ firstname, lastname, email, password });

    await setTokenCookie(res, user);

    res.status(200);
    return res.json({
      user,
      // id: user.id,
      // firstname: user.firstname,
      // lastname: user.lastname,
      // email: user.email,
      token: req.cookies.token
    });
  }
}
);

router.get('/demoUser', async (req, res) => {
  const user = await User.login({ email: 'demouser@gmail.com', password: 'password' });

  // console.log(user)
  setTokenCookie(res, user);
  res.status(200);
  return res.json({
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    token: req.cookies.token
  });
})


module.exports = router;
