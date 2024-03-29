const express = require('express');
//validator
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { Spot, Image, User, Review } = require('../../db/models');
const router = express.Router();

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage("Review text is required"),
    check('stars')
        .exists({ checkFalsy: true })
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
];

// ADD IMAGE TO REVIEW BASED ON review_id
router.post('/:review_id/images', restoreUser, requireAuth, async (req, res, next) => {

        const { review_id } = req.params;
        const { url } = req.body;

        const user = await User.findOne({
            where: {
                id: req.user.id
            }
        });

        const review = await Review.findOne({
            where: {
                id: review_id,
                user_id: user.id
            }
        });

        const reviewAuthorize = await Review.findByPk(review_id);

        if (reviewAuthorize && reviewAuthorize.user_id !== req.user.id) {
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
                image_id: review_id
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
//     let multipleUploadedImgUrl;

//     const { url } = req.body;
//     let { review_id } = req.params;
//     review_id = parseInt(review_id);

//     const review = await Review.findByPk(review_id);
//     const allReviewImagesCount = await Image.count({
//         where: {
//             review_id
//         },
//         attributes: {
//             url
//         }
//     })

//     if (review) {
//         if (req.user.id === review.user_id) {
//             if (allReviewImagesCount >= 10) {
//                 res.status(400);
//                 const err = new Error("Maximum number of images for this resource was reached");
//                 err.message = "Maximum number of images for this resource was reached";
//                 err.status = 400;
//                 return next(err);
//             } else {

//                 const responseArr = [];
//                 multipleUploadedImgUrl.forEach((img, index) => {

//                     const image = Image.create({
//                         image_type: 'Review',
//                         url: img,
//                         spot_id: null,
//                         review_id
//                     });

//                     responseArr.push(image);
//                 })


//                 res.status(200);
//                 res.json(responseArr);
//             }
//         } else {
//             res.status(403)
//             const err = new Error('Forbidden');
//             err.message = 'Forbidden';
//             err.status = 403;
//             return next(err);
//         }
//     } else {
//         res.status(404);
//         const err = new Error("Review couldn't be found");
//         err.message = "Review couldn't be found";
//         err.status = 404;
//         return next(err);
//     }

// });


// GET REVIEWS OF CURRENT USER
router.get('/me', restoreUser, requireAuth, async (req, res) => {
    const Reviews = await Review.findAll({
        where: {
            user_id: req.user.id
        },
        include: [
            {
                model: Spot,
                attributes: { exclude: ['createdAt', 'updatedAt', 'description'] }
            },
            {
                model: Image,
                attributes: ['url']
            },
            {
                model: User,
                attributes: { exclude: ['email', 'password', 'createdAt', 'updatedAt'] }
            }]
    });

    res.status(200);
    return res.json({ Reviews });
});


// GET REVIEW BY ID
router.get('/:review_id', async (req, res) => {
    const { review_id } = req.params;
    const review = await Review.findByPk(review_id);
    res.status(200);
    res.json(review);

})

// EDIT REVIEW
router.put('/:review_id', restoreUser, requireAuth, validateReview, async (req, res, next) => {
    const { review_id } = req.params;
    const { review, stars } = req.body;
    const editReview = await Review.findByPk(review_id);

    if (editReview) {
        if (editReview.user_id === req.user.id) {
            editReview.review = review;
            editReview.stars = stars;
            await editReview.save();
            res.status(200);
            return res.json(editReview);
        } else {
            const err = new Error('Forbidden');
            err.message = 'Forbidden';
            err.status = 403;
            return next(err);
        }

    } else {
        res.status(404);
        const err = new Error("Review couldn't be found");
        err.message = "Review couldn't be found";
        err.status = 404;
        return next(err);
    }
});

// DELETE REVIEW
router.delete('/:review_id', restoreUser, requireAuth, async (req, res, next) => {
    const { review_id } = req.params;

    const review = await Review.findByPk(review_id);

    if (review) {
        if (review.user_id === req.user.id) {
            await review.destroy();
            res.status(200);
            const err = new Error("Successfully deleted");
            err.message = "Successfully deleted";
            err.status = 200;
            return next(err);

        } else {
            const err = new Error('Forbidden');
            err.message = 'Forbidden';
            err.status = 403;
            return next(err);
        }

    } else {
        res.status(404);
        const err = new Error("Review couldn't be found");
        err.message = "Review couldn't be found";
        err.status = 404;
        return next(err);

    }

})



module.exports = router;
