const express = require('express');

//validator
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Op } = require("sequelize");

const { Spot, Image, Review } = require('../../db/models');
const router = express.Router();


router.delete('/:image_id', requireAuth, async (req, res, next) => {
    const { image_id } = req.params;
    const image = await Image.findByPk(image_id)
    const spot = await Spot.findOne({
        where: {
            owner_id: req.user.id
        }
    })
    const review = await Review.findOne({
        where: {
            user_id: req.user.id
        }
    })

    if (image) {
        // if (req.user.id === spot.owner_id) {
        if ((spot.id === image.spot_id) && (image.image_type === 'Spot')) {
            image.destroy();
            res.status(200);
            res.json({
                "message": "Successfully deleted",
                "statusCode": 200
            })


        }
        // else {
        //     const err = new Error('Forbidden');
        //     err.message = 'Forbidden';
        //     err.status = 403;
        //     return next(err);
        // }
        // console.log(review.id, image.review_id, image.image_type)
        else if ((review.id === image.review_id) && (image.image_type === 'Review')) {
            image.destroy();
            res.status(200);
            res.json({
                "message": "Successfully deleted",
                "statusCode": 200
            })


        } else {
            res.status(403)
            const err = new Error('Forbidden');
            err.message = 'Forbidden';
            err.status = 403;
            return next(err);
        }

    } else {
        res.status(404);
        const err = new Error("Image couldn't be found");
        err.message = "Image couldn't be found";
        err.status = 404;
        return next(err);
    }
})



module.exports = router;
