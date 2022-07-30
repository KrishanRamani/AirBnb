const express = require('express');

//validator
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Op } = require("sequelize");

const { Booking, Spot, Image } = require('../../db/models');
const router = express.Router();




// GET ALL OF THE CURRENT USERS BOOKING
router.get('/me', restoreUser, requireAuth, async (req, res) => {
    const Bookings = await Booking.findAll({
        where: {
            user_id: req.user.id
        },
        include: {
            model: Spot,
            attributes: { exclude: ['description', 'createdAt', 'updatedAt'] },
            include: {
                model: Image,
                attributes: ['url']
            },
        }
    })


    Bookings.forEach(booking => {
        booking.dataValues.Spot.dataValues.preview_image = booking.dataValues.Spot.dataValues.Images;
        delete booking.dataValues.Spot.dataValues.Images;

    })

    res.status(200);
    return res.json({ Bookings });
});

// GET A BOOKING BY ID
router.get('/:booking_id', async (req, res) => {
    const { booking_id } = req.params;
    const Bookings = await Booking.findOne({
        where: {
            id: booking_id
        }
    });
    res.status(200);
    res.json({ Bookings })
})

// EDIT A BOOKING
router.put('/:booking_id', restoreUser, requireAuth, async (req, res, next) => {
    const { booking_id } = req.params;
    const booking = await Booking.findByPk(booking_id);

    let { start_date, end_date } = req.body;
    start_date = new Date(start_date);
    end_date = new Date(end_date);
    const curDate = new Date();

    let isClearBooking;


    if (booking) {

        const allBookingsForSpot = await Booking.findAll({
            where: {
                [Op.and]: [
                    { spot_id: booking.spot_id },
                    {
                        id:
                        {
                            [Op.not]: booking_id
                        }
                    }
                ]

            }
        });
        // console.log(allBookingsForSpot)

        allBookingsForSpot.forEach(booking => {
            if (((start_date <= booking.dataValues.start_date) && (end_date >= booking.dataValues.start_date)) || ((start_date >= booking.dataValues.start_date) && (booking.dataValues.end_date >= start_date))) {
                isClearBooking = true;
            }
        })
        // console.log(`isClearBooking: ${isClearBooking}`)

        if (req.user.id === booking.user_id) {

            if (!isClearBooking) {

                // console.log(curDate, booking.end_date)
                if (curDate >= booking.end_date) {
                    res.status(400);
                    const err = new Error("Past bookings can't be modified");
                    err.message = "Past bookings can't be modified";
                    err.status = 400;
                    return next(err);

                } else {
                    booking.start_date = start_date;
                    booking.end_date = end_date;
                    await booking.save();

                    res.status(200);
                    return res.json(booking);

                }
            } else {
                res.status(403);
                const err = new Error("Sorry, this spot is already booked for the specified dates");
                err.message = "Sorry, this spot is already booked for the specified dates";
                err.status = 403;
                err.errors = {
                    start_date: "Start date conflicts with an existing booking",
                    end_date: "End date conflicts with an existing booking"
                }
                return next(err);
            }

        } else {
            const err = new Error('Forbidden');
            err.message = 'Forbidden';
            err.status = 403;
            return next(err);
        }

    } else {
        res.status(404)
        const err = new Error("Booking couldn't be found");
        err.message = "Booking couldn't be found";
        err.status = 404;
        return next(err);
    }

});

// DELETE A BOOKING
router.delete('/:booking_id', restoreUser, requireAuth, async (req, res, next) => {
    const { booking_id } = req.params;
    const booking = await Booking.findOne({
        where: {
            id: booking_id
        }
    });
    const date = new Date();


    if (booking) {
        if (date >= booking.start_date) {
            res.status(400);
            const err = new Error("Bookings that have been started can't be deleted");
            err.message = "Bookings that have been started can't be deleted";
            err.status = 400;
            return next(err);

        } else {
            if (req.user.id === booking.user_id) {
                booking.destroy();
                res.status(200);
                res.json({
                    "message": "Successfully deleted",
                    "statusCode": 200
                })
            } else {
                const err = new Error('Forbidden');
                err.message = 'Forbidden';
                err.status = 403;
                return next(err);
            }
        }
    } else {
        res.status(404);
        const err = new Error("Booking couldn't be found");
        err.message = "Booking couldn't be found";
        err.status = 404;
        return next(err);
    }
})


module.exports = router;
