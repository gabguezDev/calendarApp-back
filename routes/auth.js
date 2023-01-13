const express = require("express");

const { check } = require("express-validator");

const router = express.Router();

const { createUser, loginUser, tokenRenew } = require("../controllers/auth");

const { fieldValidator } = require("../middlewares/validate-field");
const { jwtValidate } = require("../middlewares/validate-jwt");

/*
  Rutas de usuarios / auth

  host + /api/auth
*/
router.post(
	"/new",
	[
		/* Aqui van los middlewares */
		check("name")
			.not()
			.isEmpty()
			.withMessage("Name must exists")
			.isLength({ min: 2, max: 40 }),
		check("email")
			.not()
			.isEmpty()
			.withMessage("Email must exists")
			.isEmail()
			.withMessage("Email debe ser un email válido."),
		check("password")
			.not()
			.isEmpty()
			.withMessage("Password must exists")
			.isLength({ min: 5 })
			.withMessage("Password must be at least 5 chars long"),
		fieldValidator,
	],
	createUser
);

router.post(
	"/",
	[
		/* Aqui van los middlewares */
		check("email")
			.not()
			.isEmpty()
			.withMessage("Email must exists")
			.isEmail()
			.withMessage("Email debe ser un email válido."),
		check("password").not().isEmpty().withMessage("Password must exists"),
		fieldValidator,
	],
	loginUser
);

router.get("/renew", jwtValidate, tokenRenew);

module.exports = router;
