const express = require("express");
const User = require("../modal/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "iamsajidprogrammer"; // the value of JWT_SECRET is a string which will be yours singnature.
let success = false;

// Route: 01
// creating a new user using method POST:  '/api/auth/createuser'   -: Does not require auth (login require nh h)
router.post(
  "/createuser",
  [
    // validation checks on user data
    body(
      "name",
      "Enter valid name, length of the name must be three or above,"
    ).isLength({ min: 1 }),
    body("email", "Enter valid email address").isEmail(),
    body("password", "password lenght must be greather than two").isLength({
      min: 1,
    }),
  ],
  async (req, res) => {
    // Finds the validation errors in this request, if there are error return bad request and errors and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // check weather the user with the same email exist already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(404)
          .json({ error: "Sorry the user with this email already exist" });
      }
      // creating secure password
      const salt = await bcrypt.genSalt(10); // making salt using genSalt method
      const encryptedPassword = await bcrypt.hash(req.body.password, salt); //converting plain password into hash and adding salt
      //creating user in db
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: encryptedPassword,
      });
      // getting id of user and adding json web token with that id and sent as reponse
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
      res.status(200).send("Congrats! account created succesfully");
    } catch (error) {
      console.error(error.message);
      // res.status(500).send("Internal Server Error");
    }
  }
);
// // Route: 02
// authenticating a user using method POST:  '/api/auth/login'   -: Does not require login
router.post(
  "/login",
  [
    // validation checks on user data
    body("email", "Enter a valid email").isEmail(),
    body("password", "password can nott be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // Finds the validation errors in this request, if therer are error return bad request and errors and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // check weather the user with the same email exist already
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: "Invalid Credentials" });
      }

      const comparePassord = await bcrypt.compare(password, user.password);
      if (!comparePassord) {
        return res.status(400).json({ error: "Invalid Credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);

      res.status(500).send("Internal Server Error");
    }
  }
);

// Route: 03
// Providing user detail to user using method POST:  '/api/auth/getuser'   -: Login require

router.post("/getuser", fetchuser, async (req, res) => {
  let success = false;
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    let success = true;
    // console.log(user);
    res.send({ user });
  } catch (error) {
    console.error(error.message);

    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
