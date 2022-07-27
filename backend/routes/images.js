const express = require('express');
const router = express.Router();
const { Image, User, Spot, Review } = require('../db/models');
const { requireAuth } = require('../utils/auth');

router.delete('/:image_id', requireAuth, async (req, res, next) => {
    const { image_id } = req.params;
    const user = await User.findOne({
        where: { id: req.user.id }
    });

    const imageAuthorise = await Image.findByPk(image_id);

    if (imageAuthorise && imageAuthorise.image_id !== req.user.id) {
        const err = Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    const getImage = await Image.findOne({
        where: { id: image_id }
    });

    let getSpot, getReview;

    if (getImage) {
        getSpot = await Spot.findOne({
            where: {
                id: getImage.image_id,
                owner_id: user.id
            }
        });

        getReview = await Review.findOne({
            where: {
                id: getImage.image_id,
                user_id: user.id
            }
        });



        getImage.destroy();

        res.json({
            message: "Successfully deleted",
            statusCode: res.statusCode
        });
    }

    if (!(getSpot || getReview)) {
        const err = new Error("Image couldn't be found");
        err.status = 404;
        return next(err);
    }
});

module.exports = router;
