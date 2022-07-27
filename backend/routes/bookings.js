// backend/routes/bookings
const express = require('express');
const router = express.Router();
const { Booking, User, Spot } = require('../db/models');
const { requireAuth } = require('../utils/auth');


router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const { bookingId } = req.params;

    const {
        startDate,
        endDate
    } = req.body;

    const currentUser = await User.findOne({
        where: {
            id: req.user.id
        }
    });


    const bookingAuthorize = await Booking.findByPk(bookingId);

    if (bookingAuthorize && bookingAuthorize.userId !== req.user.id) {
        const err = Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    const booking = await Booking.findOne({
        where: {
            id: bookingId,
            userId: currentUser.id
        }
    });

    if (!booking) {
        const err = Error("Booking couldn't be found");
        err.status = 404;
        return next(err);
    }

    const endDateCompare = booking.endDate.toISOString().split('T')[0];
    const dateNowCompare = new Date().toISOString().split('T')[0];
    const startDateCompare = booking.startDate.toISOString().split('T')[0];

    if (endDateCompare < dateNowCompare) {
        const err = Error("Past bookings can't be modified");
        err.status = 403;
        return next(err);
    }

    if (booking) {
    if (startDateCompare === startDate || endDateCompare === endDate) {
            const err = Error("Sorry this spot is already booked for the specified dates");
            err.status = 403;
            err.errors = {};
            if (startDateCompare === startDate) {
                err.errors.startDate = "Start date conflicts with an existing booking";
            }
            if (endDateCompare === endDate) {
                err.errors.endDate = "End date conflicts with an existing booking";
            }
            return next(err);
        }
    }

    const updateBooking = await booking.update({
        startDate,
        endDate
    });

    res.json(updateBooking);
});


router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const { bookingId } = req.params;

    const user = await User.findOne({
        where: {
            id: req.user.id
        }
    });

    const bookingAuthorize = await Booking.findByPk(bookingId);

    if (bookingAuthorize && bookingAuthorize.userId !== req.user.id) {
        const err = Error("Forbidden");
        err.status = 403;
        return next(err);
    }

    const spot = await Spot.findOne({
        where: {
            ownerId: user.id
        }
    });

    const booking = await Booking.findOne({
        where: {
            id: bookingId,
            userId: user.id
        }
    });

    if (!booking || !spot) {
        const err = Error("Booking couldn't be found");
        err.status = 404;
        return next(err);
    }

    const startDateCompare = booking.startDate.toISOString().split('T')[0];
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
