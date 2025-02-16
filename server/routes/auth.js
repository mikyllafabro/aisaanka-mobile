const express = require("express");
const router = express.Router();

const { Register, Login} = require('../controllers/Auth');

router.get("/homescreen", HomeScreen);
router.post("/signup", Register);
router.post("/login", Login);

module.exports = router;