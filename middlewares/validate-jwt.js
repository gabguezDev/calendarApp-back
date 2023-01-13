const { response } = require("express");
const jwt = require("jsonwebtoken");

const jwtValidate = (req, res = response, next) => {
	// x-token headers

	const token = req.header("x-token");

	if (!token) {
		return res.status(401).json({
			ok: false,
			msg: "Token validation failed.",
		});
	}

	try {
		const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);

		req.uid = uid;
		req.name = name;
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: "Token validation failed.",
		});
	}

	next();
};

module.exports = {
	jwtValidate,
};
