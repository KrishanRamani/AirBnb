// backend/routes/bookings
const express = require('express');
const router = express.Router();
const { Booking, User, Spot } = require('../db/models');
const { requireAuth } = require('../utils/auth');


router.put('/:booking_id', requireAuth, async (req, res, next) => {
    const { booking_id } = req.params;

    const {
        start_date,
        end_date
    } = req.body;

    const currentUser = await User.findOne({
        where: {
            id: req.user.id
        }
    });


    const bookingAuthorize = await Booking.findByPk(booking_id);

    if (bookingAuthorize && bookingAuthorize.user_id !== req.user.id) {
        const err = Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    const booking = await Booking.findOne({
        where: {
            id: booking_id,
            user_id: currentUser.id
        }
    });

    if (!booking) {
        const err = Error("Booking couldn't be found");
        err.status = 404;
        return next(err);
    }

    const endDateCompare = booking.end_date.toISOString().split('T')[0];
    const dateNowCompare = new Date().toISOString().split('T')[0];
    const startDateCompare = booking.start_date.toISOString().split('T')[0];

    if (endDateCompare < dateNowCompare) {
        const err = Error("Past bookings can't be modified");
        err.status = 403;
        return next(err);
    }

    if (booking) {
    if (startDateCompare === start_date || endDateCompare === end_date) {
            const err = Error("Sorry this spot is already booked for the specified dates");
            err.status = 403;
            err.errors = {};
            if (startDateCompare === start_date) {
                err.errors.start_date = "Start date conflicts with an existing booking";
            }
            if (endDateCompare === enddate) {
                err.errors.end_date = "End date conflicts with an existing booking";
            }
            return next(err);
        }
    }

    const updateBooking = await booking.update({
        start_date,
        end_date
    });

    res.json(updateBooking);
});


router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const { booking_id } = req.params;

    const user = await User.findOne({
        where: {
            id: req.user.id
        }
    });

    const bookingAuthorize = await Booking.findByPk(booking_id);

    if (bookingAuthorize && bookingAuthorize.user_id !== req.user.id) {
        const err = Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    const spot = await Spot.findOne({
        where: {
            owner_id: user.id
        }
    });

    const booking = await Booking.findOne({
        where: {
            id: booking_id,
            user_id: user.id
        }
    });

    if (!booking || !spot) {
        const err = Error("Booking couldn't be found");
        err.status = 404;
        return next(err);
    }

    const startDateCompare = booking.start_date.toISOString().split('T')[0];
    const dateNowCompare = new Date().toISOString().split('T')[0];

    if (startDateCompare < dateNowCompare) {
        const err = Error("Bookings that have been started can't be deleted");
        err.status = 403;
        return next(err);
    }

    res.json({
        message: "Successfully deleted",
        statusCode: res.statusCode
    });
});

module.exports = router;
