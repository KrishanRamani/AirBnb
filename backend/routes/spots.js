const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const { Spot, Image, Review, User, Booking } = require('../db/models');
const { requireAuth } = require('../utils/auth');
const { check } = require('express-validator');
const { query } = require('express-validator/check');
const { handleValidationErrors } = require('../utils/validation');

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Longitude is not valid'),

    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name must be less than 50 characters'),
    check('name')
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),

    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price per day is required'),
    handleValidationErrors
];

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isFloat({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

const validateQuery = [
    query('page')
        .isInt({ min: 0 })
        .default(0)
        .optional()
        .withMessage('Page must be greater than or equal to 0'),
    check('size')
        .isInt({ min: 0 })
        .default(30)
        .optional()
        .withMessage('Size must be greater than or equal to 0'),
    check('minLat')
        .isDecimal()
        .optional()
        .withMessage('Minimum latitude is invalid'),
    check('maxLat')
        .isDecimal()
        .optional()
        .withMessage('Maximum latitude is invalid'),
    check('minLng')
        .isDecimal()
        .optional()
        .withMessage('Minimum longitude is invalid'),
    check('maxLng')
        .isDecimal()
        .optional()
        .withMessage('Maximum longitude is invalid'),
    check('minPrice')
        .isFloat({ min: 0 })
        .optional()
        .withMessage('Minimum price must be greater than 0'),
    check('maxPrice')
        .isFloat({ min: 0 })
        .optional()
        .withMessage('Maximum price must be greater than 0'),
    handleValidationErrors
];

router.get('/:spot_id/bookings', requireAuth, async (req, res, next) => {
    const { spot_id } = req.params;

    const user = await User.findOne({
        where: { id: req.user.id }
    });

    const spotOwner = await Spot.findOne({
        where: { owner_id: user.id }
    });

    // TODO: Couldn't find a Spot with the specified id
    const findSpot = await Spot.findByPk(spot_id);

    if (!findSpot) {
        const err = Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    let booking;
    if (!spotOwner) {
        booking = await Booking.scope('notOwner').findAll({
            where: {
                spot_id
            }
        });
    } else {
        booking = await Booking.findAll({
            where: { spot_id },
            include: { model: User }
        });
    }
    res.json({
        Bookings: booking
    });
});

router.get('/:spot_id/reviews', async (req, res, next) => {

    const { spot_id } = req.params;
    const reviews = await Review.findAll({
        where: {
            spot_id
        },
        include: [
            { model: User }
        ]
    });

    if (!reviews.length) {
        const err = Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    for (const review of reviews) {
        const images = await Image.findAll({ where: { image_id: review.id } });
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


router.get('/:spot_id', async (req, res, next) => {
    const { spot_id } = req.params;
    //const spot = await Spot.findByPk(spot_id);
    const getSpot = await Spot.findOne({
        attributes: [
            '*',
        ],
        where: {
            id: spot_id
        },
        raw: true,
        subQuery: false,
    });

    const getReview = await Review.findOne({
        attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('stars')), 'numReviews'],
            [Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('stars')), 1), 'avgStarRating']
        ],
        raw: true
    });

    if (!getSpot) {
        const err = Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    const getImage = await Image.findAll({
        where: {
            image_id: getSpot.id
        }
    });

    const getOwner = await User.findByPk(getSpot.owner_id);

    const spotDetail = {
        ...getSpot,
        ...getReview,
        Images: getImage,
        Owners: getOwner
    };

    res.json(spotDetail)
});

router.get('/', validateQuery, async (req, res) => {

    const { Op } = require('sequelize');

    let page = Number(req.query.page);
    let size = Number(req.query.size);

    if (isNaN(page) || page <= 0) page = 0;
    if (isNaN(size) || size < 0) size = 30;

    if (page > 10) page = 0;
    if (size > 30) size = 30;

    const limit = size;
    const offset = size * (page - 1) >= 0 ? size * (page - 1) : 0;

    const where = {};
    const { minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    if (minLat) where.lat = { [Op.gte]: Number(minLat) };
    if (maxLat) where.lat = { [Op.lte]: Number(maxLat) };
    if (minLng) where.lng = { [Op.gte]: Number(minLng) };
    if (maxLng) where.lng = { [Op.lte]: Number(maxLng) };
    if (minPrice) where.price = { [Op.gte]: Number(minPrice) };
    if (maxPrice) where.price = { [Op.lte]: Number(maxPrice) };

    const spots = await Spot.findAll({
        include: {
            model: Image,
            attributes: []
        },
        where,
        limit,
        offset
    });

    res.json({
        "Spots": spots,
        page,
        size
    });
});


let user;
const authorization = async (req, res, next) => {
    user = await User.findOne({
        where: {
            id: req.user.id
        }
    });
    next();
}

router.post('/:spot_id/bookings',
    requireAuth, authorization, async (req, res, next) => {
        const { spot_id } = req.params;
        const {
            start_date,
            end_date
        } = req.body;

        const spot = await Spot.findByPk(spot_id);

        if (!spot) {
            const err = Error("Spot couldn't be found");
            err.status = 404;
            return next(err);
        }

        if (spot.owner_id === user.id) {
            const err = Error("Spot must NOT belong to the current user");
            return next(err);
        }

        if (end_date <= start_date) {
            const err = Error("Validation error");
            err.status = 400;
            err.errors = {
                end_date: "endDate cannot be on or before startDate"
            };
            return next(err);
        }

        const findBooking = await Booking.findOne({
            where: {
                spot_id,
                user_id: user.id,
            }
        });

        if (findBooking) {
            const startDateCompare = findBooking.start_date.toISOString().split('T')[0];
            const endDateCompare = findBooking.end_date.toISOString().split('T')[0];

            if (startDateCompare === start_date || endDateCompare === end_date) {
                const err = Error("Sorry, this spot is already booked for the specified dates");
                err.status = 403;
                err.errors = {};

                if (startDateCompare === start_date) {
                    err.errors.start_date = "Start date conflicts with an existing booking";
                }

                if (endDateCompare === end_date) {
                    err.errors.end_date = "End date conflicts with an existing booking";
                }

                return next(err);
            }
        }
        const booking = await Booking.create({
            spot_id,
            user_id: user.id,
            start_date,
            end_date
        });

        res.json(booking);
    });

router.post('/:spot_id/images', requireAuth, async (req, res, next) => {
    const { spot_id } = req.params;
    const { url } = req.body;
    const user = await User.findOne({
        where: {
            id: req.user.id
        }
    });

    const spotAuthorize = await Spot.findByPk(spot_id);

    if (spotAuthorize && spotAuthorize.owner_id !== req.user.id) {
        const err = Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    const spot = await Spot.findOne({
        where: {
            id: spot_id,
            owner_id: user.id
        }
    });

    if (!spot) {
        const err = Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    const image = await spot.createImage({
        url
    });

    const imageCreated = await Image.findByPk(image.id);

    res.json(imageCreated);
});

router.post('/:spot_id/reviews', validateReview,
    requireAuth, async (req, res, next) => {
        const { spot_id } = req.params;
        const { review, stars } = req.body;
        const user = await User.findOne({
            where: {
                id: req.user.id
            }
        });

        const spot = await Spot.findByPk(spot_id);

        if (!spot) {
            const err = Error("Spot couldn't be found");
            err.status = 404;
            return next(err);
        }

        const getReview = await Review.findOne({
            where: {
                user_id: user.id
            }
        });

        if (getReview) {
            const err = Error("User already has a review for this spot");
            err.status = 403;
            return next(err);
        }

        const spotReview = await Review.create({
            user_id: user.id,
            spot_id,
            review,
            stars
        });

        res.json(
            spotReview
        );
    });


router.post('/', requireAuth, validateSpot, async (req, res) => {

    const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    } = req.body;


    const user = await User.findOne({
        where: {
            id: req.user.id
        }
    });

    const postSpot = await Spot.create({
        owner_id: user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    const spotReturn = await Spot.scope('hideImage').findByPk(postSpot.id);

    res.status(201);
    res.json(spotReturn);
});

router.put('/:spot_id',
    requireAuth, validateSpot, async (req, res, next) => {
        const { spot_id } = req.params;
        const {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        } = req.body;

        const spotAuthorize = await Spot.findByPk(spot_id);

        if (spotAuthorize && spotAuthorize.owner_id !== req.user.id) {
            const err = Error("Forbidden");
            err.status = 403;
            return next(err);
        }

        const currentUser = await User.findOne({
            where: {
                id: req.user.id
            }
        });

        const spot = await Spot.findOne({
            where: {
                id: spot_id,
                owner_id: currentUser.id
            }
        });

        if (!spot) {
            const err = Error("Spot couldn't be found");
            err.status = 404;
            return next(err);
        }

        const updateSpot = await spot.update({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        });

        const spotReturn = await Spot.scope('hideImage').findByPk(updateSpot.id);

        return res.json(spotReturn);
    });

router.delete('/:spot_id', requireAuth, async (req, res, next) => {
    const { spot_id } = req.params;
    const currentUser = await User.findOne({
        where: {
            id: req.user.id
        }
    });

    const spotAuthorize = await Spot.findByPk(spot_id);
    if (spotAuthorize && spotAuthorize.owner_id !== req.user.id) {
        const err = Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    const spotToDestroy = await Spot.findOne({
        where: {
            id: spot_id,
            owner_id: currentUser.id
        }
    });

    if (!spotToDestroy) {
        const err = Error("Spot couldn't be found");
        err.status = 404;
        return next(err);
    }

    spotToDestroy.destroy();

    res.json({
        message: "Successfully deleted",
        statusCode: res.statusCode
    });

});

module.exports = router;
