const { request } = require("express");
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secretKey = require("../../config/keys").secretKey;

// Load User Schema
const User = require("../../models/User");

// @route       GET api/users/test
// @desc        Tests users route
// @access      Public
router.get("/test", (req, res) => res.json({ message: "Users Works" }));

// @route       POST api/users/register
// @desc        Register User
// @access      Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm", // Default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route       POST api/users/login
// @desc        User Login
// @access      Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Find user by Email
  User.findOne({ email }).then((user) => {
    // Check User
    if (!user) {
      return res.status(404).json({ email: "User not found." });
    }

    // Compare Password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        // Sign Token
        jwt.sign(payload, secretKey, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token,
          });
        });
      } else {
        res.status(400).json({ password: "Incorrect Password" });
      }
    });
  });
});

module.exports = router;