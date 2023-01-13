const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
} = require("../controllers/events");

const { jwtValidate } = require("../middlewares/validate-jwt");
const { fieldValidator } = require("../middlewares/validate-field");
const { isDate } = require("../helpers/isDate");

router.use(jwtValidate);

// Get events
// All have to be validated by JWT

/* 
  URL -> /api/events
*/

// Get events
router.get("/", getEvents);

// Create new event
router.post(
	"/new",
	[
		check("title")
			.not()
			.isEmpty()
			.withMessage("Event must have a title.")
			.isLength({ min: 1, max: 70 })
			.withMessage("Event title must have 70 chars max."),
		check("start")
			.not()
			.isEmpty()
			.withMessage("Event must have a start date.")
			.custom(isDate)
			.withMessage("Start must be a Date"),
		check("end")
			.not()
			.isEmpty()
			.withMessage("Event must have an end date.")
			.custom(isDate)
			.withMessage("End must be a Date"),
		fieldValidator,
	],
	createEvent
);

// Update event
router.put("/update/:id", updateEvent);

// Delete event
router.delete("/delete/:id", deleteEvent);

module.exports = router;
