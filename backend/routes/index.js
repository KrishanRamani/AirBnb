const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
const apiUserRouter = require('./api/users');
const apiSessionRouter = require('./api/session');
const userRouter = require('./users');
const spotRouter = require('./spots');
const reviewRouter = require('./reviews');
const bookingRouter = require('./bookings');
const imageRouter = require('./images');
const { restoreUser } = require('../utils/auth');

router.use(restoreUser);

router.use('/api', apiRouter);
router.use('/login', apiSessionRouter);
router.use('/signup', apiUserRouter);
router.use('/users', userRouter);
router.use('/spots', spotRouter);
router.use('/reviews', reviewRouter);
router.use('/bookings', bookingRouter);
router.use('/images', imageRouter);

router.get('/api/csrf/restore', (req, res) => {
  const csrfToken = req.csrfToken();

  res.cookie("XSRF-TOKEN", csrfToken);

  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});

module.exports = router;
