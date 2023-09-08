const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const crypto = require("crypto");

const router = express.Router();
const saltRounds = 10;

// Create new User
router.post("/signup", (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (email === "" || password === "" || firstName === "" || lastName === "") {
    res
      .status(400)
      .json({ message: "Provide email, first name, last name and passoword" });
  }

  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address" });
    return;
  }
  // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter."
    });
    return;
  }

  User.findOne({ email }).then((foundUser) => {
    if (foundUser) {
      res.status(400).json({
        message:
          "User already exists. Please login with your email and password"
      });
      return;
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    return User.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      emailToken: crypto.randomBytes(64).toString("hex"),
      passwordResetToken: crypto.randomBytes(64).toString("hex")
    })
      .then((createdUser) => {
        const {
          _id,
          email,
          firstName,
          lastName,
          emailToken,
          passwordResetToken
        } = createdUser;

        const user = {
          _id,
          email,
          firstName,
          lastName,
          emailToken,
          passwordResetToken
        };

        //   sendVerificationMail(user)
        res.status(201).json({ user: user });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
      });
  });
});

module.exports = router;
