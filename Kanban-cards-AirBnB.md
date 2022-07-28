# Kanban Project Board Cards

The following cards will guide the implementation of the AirBnB API. Each
section should be copied into it's own card on the Kanban project board.
Each feature's progress should be tracked by checking off requirements as they
are met and progressing the cards from the `Backlog`, `Next Tasks`,
`In Progress`, `In Review`, and `Accepted` columns.

## Kanban Cards

Copy each of the following sections into its own card on a Kanban board for the
project. GitHub Kanban boards use markdown formatting, allowing these sections
to be copied directly:

### Authentication Required

All endpoints that require a current user to be logged in receive a standard
authentication response.

- [ ] Authentication middleware responds with error status 401 when
      authentication is not provided

### Authorization Required

All endpoints that require a current user to have the correct role(s) or
permission(s) receive a standard authorization response.

- [ ] Authorization middleware responds with error status 403 when
      an authenticated user does not have the correct role(s) or permission(s)

### Sign Up a User (Feature 0)

Creates a new user, logs them in as the current user, and returns the current
user's information.

- [ ] New user exists in the database after request
- [ ] Successful response includes newly created `id`, `firstname`, `lastname`,
      `email`, and `token`
- [ ] Error response with status 403 is given when the specified email already
      exists
- [ ] Error response with status 400 is given when body validations for the
      `email`, `firstname`, or `lastname` are violated

### Log In a User (Feature 0)

Logs in a current user with valid credentials and returns the current user's
information.

- [ ] Successful response includes the user's `id`, `firstname`, `lastname`,
      `email`, and `token`
- [ ] Error response with status 401 is given when invalid credentials are given
- [ ] Error response with status 400 is given when body validations for the
      `email`, `firstname`, or `lastname` are violated

### Get the Current User (Feature 0)

Returns the information about the current user that is logged in.

- [ ] An authenticated user is required for a successful response
- [ ] Successful response includes the user's `id`, `firstname`, `lastname`,
      `email`, and `token`

### Get all Spots (Feature 1)

Returns all the spots.

- [ ] Seed data exists in the database for spots to be returned.
- [ ] Successful response includes each spot in the database.
- [ ] Spot data returned includes the `id`, `owner_id`, `address`, `city`,
      `state`, `country`, `lat`, `lng`, `name`, `description`, `price`, `createdAt`,
      `updatedAt`, and `preview_image`

### Get all Spots owned by the Current User (Feature 1)

Returns all the spots owned (created) by the current user.

- [ ] An authenticated user is required for a successful response
- [ ] Successful response includes only spots created by the current user
- [ ] Spot data returned includes the `id`, `owner_id`, `address`, `city`,
      `state`, `country`, `lat`, `lng`, `name`, `description`, `price`, `createdAt`,
      `updatedAt`, and `preview_image`

### Get details for a Spot from an id (Feature 1)

Returns the details of a spot specified by its id.

- [ ] Successful response includes data only for the specified spot
- [ ] Spot data returned includes the `id`, `owner_id`, `address`, `city`,
      `state`, `country`, `lat`, `lng`, `name`, `description`, `price`, `createdAt`,
      and `updatedAt`
- [ ] Spot data returns aggregate data for `numReviews` and `avgStarRating`
- [ ] Spot data returns associated data for `images`, an array of image urls
- [ ] Spot data returns associated data for `Owner`, including the `id`,
      `firstname`, and `lastname`
- [ ] Error response with status 404 is given when a spot does not exist with
      the provided `id`

### Create a Spot (Feature 1)

Creates and returns a new spot.

- [ ] An authenticated user is required for a successful response
- [ ] New spot exists in the database after request
- [ ] Spot data returned includes the `id`, `owner_id`, `address`, `city`,
      `state`, `country`, `lat`, `lng`, `name`, `description`, `price`, `createdAt`,
      and `updatedAt`
- [ ] Error response with status 400 is given when body validations for the
      `address`, `city`, `state`, `country`, `lat`, `lng`, `name`, `description`, or `price` are violated

### Edit a Spot (Feature 1)

Updates and returns an existing spot.

- [ ] An authenticated user is required for a successful response
- [ ] Only the owner of the spot is authorized to edit
- [ ] Spot record is updated in the database after request
- [ ] Spot data returned includes the `id`, `owner_id`, `address`, `city`,
      `state`, `country`, `lat`, `lng`, `name`, `description`, `price`, `createdAt`,
      and `updatedAt`
- [ ] Error response with status 400 is given when body validations for the
      `address`, `city`, `state`, `country`, `lat`, `lng`, `name`, `description`, or `price` are violated
- [ ] Error response with status 404 is given when a spot does not exist with
      the provided `id`

### Delete a Spot (Feature 1)

Deletes an existing spot.

- [ ] An authenticated user is required for a successful response
- [ ] Only the owner of the spot is authorized to delete
- [ ] Spot record is removed from the database after request
- [ ] Success response includes a `message` indicating a successful deletion
- [ ] Error response with status 404 is given when a spot does not exist with
      the provided `id`

### Get all Reviews of the Current User (Feature 2)

Returns all the reviews written by the current user.

- [ ] An authenticated user is required for a successful response
- [ ] Successful response includes only reviews created by the current user
- [ ] Review data returned includes the `id`, `user_id`, `spot_id`, `review`,
      `stars`, `createdAt`, and `updatedAt`
- [ ] Review data returns associated data for `User`, including the `id`,
      `firstname`, and `lastname`
- [ ] Review data returns associated data for `Spot`, including the `id`,
      `ownderId`, `address`, `city`, `state`, `country`, `lat`, `lng`, `name`, and
      `price`
- [ ] Review data returns associated data for `images`, an array of image urls

### Get all Reviews by a Spot's id (Feature 2)

Returns all the reviews that belong to a spot specified by id.

- [ ] Seed data exists in the database for reviews to be returned.
- [ ] Successful response includes only reviews for the specified spot
- [ ] Review data returned includes the `id`, `user_id`, `spot_id`, `review`,
      `stars`, `createdAt`, and `updatedAt`
- [ ] Review data returns associated data for `User`, including the `id`,
      `firstname`, and `lastname`
- [ ] Review data returns associated data for `images`, an array of image urls
- [ ] Error response with status 404 is given when a spot does not exist with
      the provided `id`

### Create a Review for a Spot based on the Spot's id (Feature 2)

Create and return a new review for a spot specified by id.

- [ ] An authenticated user is required for a successful response
- [ ] New review exists in the database after request
- [ ] Review data returned includes the `id`, `user_id`, `spot_id`, `review`,
      `stars`, `createdAt`, and `updatedAt`
- [ ] Error response with status 400 is given when body validations for the
      `review` or `stars` are violated
- [ ] Error response with status 404 is given when a spot does not exist with
      the provided `id`
- [ ] Error response with status 403 is given when a review already exists for
      the spot from the current user

### Edit a Review (Feature 2)

Update and return an existing review.

- [ ] An authenticated user is required for a successful response
- [ ] Only the owner of the review is authorized to edit
- [ ] Review record is updated in the database after request
- [ ] Review data returned includes the `id`, `user_id`, `spot_id`, `review`,
      `stars`, `createdAt`, and `updatedAt`
- [ ] Error response with status 400 is given when body validations for the
      `review`, or `stars` are violated
- [ ] Error response with status 404 is given when a review does not exist with
      the provided `id`

### Delete a Review (Feature 2)

Delete an existing review.

- [ ] An authenticated user is required for a successful response
- [ ] Only the owner of the review is authorized to delete
- [ ] Review record is removed from the database after request
- [ ] Success response includes a `message` indicating a successful deletion
- [ ] Error response with status 404 is given when a spot does not exist with
      the provided `id`

### Get all of the Current User's Bookings (Feature 3)

Return all the bookings that the current user has made.

- [ ] An authenticated user is required for a successful response
- [ ] Successful response includes only bookings created by the current user
- [ ] Booking data returned includes the `id`, `spot_id`, `user_id`, `start_date`,
      `end_date`, `createdAt`, and `updatedAt`
- [ ] Booking data returns associated data for `Spot`, including the `id`,
      `owner_id`, `address`, `city`, `state`, `country`, `lat`, `lng`, `name`,
      `price` and `preview_image`

### Get all Bookings for a Spot based on the Spot's id (Feature 3)

Return all the bookings for a spot specified by id.

- [ ] An authenticated user is required for a successful response
- [ ] Seed data exists in the database for bookings to be returned.
- [ ] Successful response includes only bookings for the specified spot
- [ ] If you are NOT the owner of the spot, booking data returned includes the
      `spot_id`, `start_date`, and `end_date` for each booking
- [ ] If you ARE the owner of the spot, booking data returned includes the `id`
      `spot_id`, `user_id`, `start_date`, `end_date`, `createdAt`, and `updatedAt` for
      each booking
- [ ] If you ARE the owner of the spot, booking data returns associated data for
      `User`, including the `id`, `firstname`, and `lastname`
- [ ] Error response with status 404 is given when a spot does not exist with
      the provided `id`

### Create a Booking from a Spot based on the Spot's id (Feature 3)

Create and return a new booking from a spot specified by id.

- [ ] An authenticated user is required for a successful response
- [ ] A user is only authorized to create a booking if they do NOT own the spot
- [ ] New booking exists in the database after request
- [ ] Booking data returned includes the `id`, `user_id`, `spot_id`, `start_date`,
      `end_date`, `createdAt`, and `updatedAt`
- [ ] Error response with status 404 is given when a spot does not exist with
      the provided `id`
- [ ] Error response with status 403 is given when a booking already exists for
      the spot on the specified dates

### Edit a Booking (Feature 3)

Update and return an existing booking.

- [ ] An authenticated user is required for a successful response
- [ ] Only the owner of the booking is authorized to edit
- [ ] Booking record is updated in the database after request
- [ ] Booking data returned includes the `id`, `user_id`, `spot_id`, `start_date`,
      `end_date`, `createdAt`, and `updatedAt`
- [ ] Error response with status 404 is given when a booking does not exist with
      the provided `id`
- [ ] Error response with status 400 is given when it is past the booking's
      `end_date` (no editing of past bookings)
- [ ] Error response with status 403 is given when a booking already exists for
      the spot on the specified dates

### Delete a Booking (Feature 3)

Delete an existing booking.

- [ ] An authenticated user is required for a successful response
- [ ] Only the owner of the booking or the owner of the spot is authorized to
      delete the booking
- [ ] Booking record is removed from the database after request
- [ ] Success response includes a `message` indicating a successful deletion
- [ ] Error response with status 404 is given when a spot does not exist with
      the provided `id`
- [ ] Error response with status 400 is given when it is past the booking's
      `start_date` (no deleting of current or past bookings)

### Add an Image to a Spot based on the Spot's id (Feature 4)

Create and return a new image for a spot specified by id.

- [ ] An authenticated user is required for a successful response
- [ ] Only the owner of the spot is authorized to add an image
- [ ] New image exists in the database after request
- [ ] Image data returned includes the `id`, `imageableId`, `image_type`, and
      `url`
- [ ] Error response with status 404 is given when a spot does not exist with
      the provided `id`

### Add an Image to a Review based on the Review's id (Feature 4)

Create and return a new image for a review specified by id.

- [ ] An authenticated user is required for a successful response
- [ ] Only the owner of the review is authorized to add an image
- [ ] New image exists in the database after request
- [ ] Image data returned includes the `id`, `imageableId`, `image_type`, and
      `url`
- [ ] Error response with status 404 is given when a review does not exist with
      the provided `id`
- [ ] Error response with status 400 is given when the maximum number of images
      have been added for the review

### Delete an Image (Feature 4)

Delete an existing image.

- [ ] An authenticated user is required for a successful response
- [ ] Only the owner of the image is authorized to delete
- [ ] Image record is removed from the database after request
- [ ] Success response includes a `message` indicating a successful deletion
- [ ] Error response with status 404 is given when an image does not exist with
      the provided `id`

### Add Query Filters to Get All Spots (Feature 4)

Return spots filtered by query parameters.

- [ ] Query parameters are accepted for `page`, `size`, `minLat`, `maxLat`,
      `minLng`, `maxLng`, `minPrice`, and `maxPrice`
- [ ] Default values are provided for the `page` and `size` parameters
- [ ] Successful response includes only spots in the database that meet the
      specified query parameters criteria.
- [ ] Spot data returned includes the `id`, `owner_id`, `address`, `city`,
      `state`, `country`, `lat`, `lng`, `name`, `description`, `price`, `createdAt`,
      `updatedAt`, and `preview_image` for each spot
- [ ] Successful response includes the `page` and `size` of the returned payload
- [ ] Error response with status 400 is given when query parameter validations
      for the `page`, `size`, `minLat`, `maxLat`, `minLng`, `maxLng`, `minPrice`, or
      `maxPrice` are violated
