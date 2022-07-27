const express = require('express');
const { Review, User, Image } = require('../db/models');
const router = express.Router();
const { requireAuth } = require('../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../utils/validation');

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
];

router.post('/:reviewId/images',
    requireAuth, async (req, res, next) => {
        const { reviewId } = req.params;
        const { url } = req.body;
        const user = await User.findOne({
            where: { id: req.user.id }
        });

        const review = await Review.findOne({
            where: {
                id: reviewId,
                userId: user.id
            }
        });

        const reviewAuthorize = await Review.findByPk(reviewId);
        if (reviewAuthorize && reviewAuthorize.userId !== req.user.id) {
            const err = Error("Forbidden");
            err.status = 403;
            return next(err);
        }

        if (!review) {
            const err = Error("Review couldn't be found");
            err.status = 404;
            return next(err);
        }

        const images = await Image.findAll({
            where: {
                imageableId: reviewId
            }
        });

        if (images.length >= 10) {
            const err = Error("Maximum number of images for this resource was reached");
            err.status = 400;
            return next(err);
        }
        const image = await review.createImage({
            url
        });

        const imageCreated = await Image.findByPk(image.id);
        res.json(imageCreated);
    });

router.put('/:reviewId', validateReview, requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;

    const { review, stars } = req.body;

    const currentUser = await User.findOne({
        where: { id: req.user.id }
    });

    const reviewExist = await Review.findByPk(reviewId);
    if (!reviewExist) {
        const err = Error("Review couldn't be found");
        err.status = 404;
        return next(err);
    }
    const getReview = await Review.findOne({
        where: {
            id: reviewId,
            userId: currentUser.id
        }
    });

    if (!getReview) {
        const err = Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    const updateReview = await getReview.update({ review, stars });
    res.json(updateReview);
});

router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    const { reviewId } = req.params;

    const currentUser = await User.findOne({
        where: { id: req.user.id }
    });
    const reviewAuthorize = await Review.findByPk(reviewId);

    if (reviewAuthorize && reviewAuthorize.userId !== req.user.id) {
        const err = Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    const reviewToDestroy = await Review.findOne({
        where: {
            id: reviewId,
            userId: currentUser.id
        }
    });

    if (!reviewToDestroy) {
        const err = Error("Review couldn't be found");
        err.status = 404;
        return next(err);
    }

    reviewToDestroy.destroy();

    res.json({
        message: "Successfully deleted",
        statusCode: res.statusCode
    });
});

module.exports = router;
