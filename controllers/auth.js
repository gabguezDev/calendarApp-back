const { response } = require("express");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");
const User = require("../models/User");
const { sign } = require("jsonwebtoken");

const createUser = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		let user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({
				ok: false,
				msg: "El email ya está en uso.",
			});
		}

		user = new User(req.body);

		// Encrypt password
		const salt = bcrypt.genSaltSync();
		user.password = bcrypt.hashSync(password, salt);

		await user.save();

		//Generar JWT
		const token = await generateJWT(user.id, user.name);

		return res.status(201).json({
			ok: true,
			msg: "User registered succesfully.",
			uid: user.id,
			name: user.name,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: "Error interno al intentar registrar el usuario.",
		});
	}
};

const loginUser = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				ok: false,
				msg: "User does not exist.",
			});
		}

		// Validar password
		const validPassword = bcrypt.compareSync(password, user.password);

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: "Password is not valid.",
			});
		}

		//Generar JWT
		const token = await generateJWT(user.id, user.name);

		return res.status(200).json({
			ok: true,
			msg: "User logged in succesfully.",
			uid: user.id,
			name: user.name,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: "Error interno al intentar registrar el usuario.",
		});
	}
};
const tokenRenew = async (req, res = response) => {
	const { uid, name } = req;

	//Generate new token
	const token = await generateJWT(uid, name);

	res.json({ ok: true, token, uid, name });
};

module.exports = {
	createUser,
	loginUser,
	tokenRenew,
};
