const { response } = require("express");
const { findById } = require("../models/Event");
const Event = require("../models/Event");

// Responses Like

const getEvents = async (req, res = response) => {
	const events = await Event.find().populate("user", "name");

	try {
		return res
			.status(200)
			.json({ ok: true, msg: "Events loaded succesfully.", events });
	} catch (error) {
		return res
			.status(500)
			.json({ ok: false, msg: "Intern error. Talk to an administrator." });
	}
};

const updateEvent = async (req, res) => {
	const { uid } = req;

	const eventId = req.params.id;

	try {
		const event = await Event.findById(eventId);

		if (!event) {
			return res.status(404).json({
				ok: false,
				msg: "Event not found.",
			});
		}

		if (event.user.toString() !== uid) {
			return res.status(401).json({
				ok: false,
				msg: "You can not update this event.",
			});
		}

		const newEvent = { ...req.body, user: uid };

		const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, {
			new: true,
		});

		return res.status(200).json({
			ok: true,
			msg: "Event updated succesfully",
			event: updatedEvent,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: "Intern error. Talk to an adminstrator.",
		});
	}
};

const createEvent = async (req, res) => {
	const { uid } = req;

	const event = new Event(req.body);

	try {
		event.user = uid;
		const savedEvent = await event.save();

		return res.status(201).json({
			ok: true,
			msg: "Event created succesfully.",
			event: savedEvent,
		});
	} catch (error) {
		console.log(error);

		return res.status(500).json({
			ok: false,
			msg: "Intern error. Talk with an administrator.",
		});
	}
};

const deleteEvent = async (req, res) => {
	const { uid } = req;

	const eventId = req.params.id;

	try {
		const event = await Event.findById(eventId);

		if (!event) {
			return res.status(404).json({
				ok: false,
				msg: "Event not found.",
			});
		}

		if (event.user.toString() !== uid) {
			return res.status(401).json({
				ok: false,
				msg: "You can not delete this event.",
			});
		}

		await Event.findByIdAndDelete(eventId);

		return res.status(200).json({
			ok: true,
			msg: "Event deleted succesfully",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: "Intern error. Talk to an adminstrator.",
		});
	}
};

module.exports = {
	getEvents,
	updateEvent,
	deleteEvent,
	createEvent,
};
