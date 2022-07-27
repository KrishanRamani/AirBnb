const express = require('express');
const { Sequelize } = require('sequelize');
const { User, Spot, Image, Review, Booking } = require('../db/models');
const router = express.Router();
const { restoreUser, requireAuth } = require('../utils/auth');

router.get('/bookings', [restoreUser, requireAuth], async (req, res, next) => {
    const bookings = await Booking.findAll({
        where: { userId: req.user.id },
        include: { model: Spot.scope('byBookings') },
    });

    res.json(
        { Bookings: bookings }
    );
});

router.get('/reviews', [restoreUser, requireAuth], async (req, res, next) => {
    const reviews = await Review.findAll({
        where: { userId: req.user.id },
        include: [
            {
                model: User
            },
            {
                model: Spot.scope('byReviews'),
            }
        ]
    });

    for (const review of reviews) {
        const images = await Image.findAll({ where: { imageableId: review.id } });
        const reviewImages = [];

        images.map(image => {
            const currentImage = {
                ...image.dataValues
            };
            reviewImages.push(currentImage);
        });

        review.dataValues['Images'] = reviewImages;
    }

    res.json({
        Reviews: reviews
    });
});

router.get('/spots', [restoreUser, requireAuth], async (req, res, next) => {
    const currentUserInfo = await User.findOne({
        where: {
            id: req.user.id
        }
    });

    if (currentUserInfo.id !== req.user.id) {
        const err = Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    const getSpot = await Spot.findAll({
        where: { ownerId: req.user.id },
        include: {
            model: Image,
            attributes: []
        },
        raw: true
    });

    res.json({ Spots: getSpot });
});

router.get('/', [restoreUser, requireAuth], async (req, res) => {
    const getUser = await User.getCurrentUserById(req.user.id);

    return res.json(getUser);
});

module.exports = router;
