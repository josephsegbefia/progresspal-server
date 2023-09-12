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

// Login
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password" });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(401).json({ messgae: "User does not exist" });
        return;
      }

      // Uncomment this later when the verify-email endpoint is done
      //   if (!foundUser.isVerified) {
      //     res.status(401).json({
      //       message:
      //         "Please verify your account. A verification link has been sent to your email"
      //     });
      //     return;
      //   }

      const correctPassword = bcrypt.compareSync(password, foundUser.password);
      if (correctPassword) {
        const { _id, email, firstName, lastName } = foundUser;

        const payload = { _id, email, firstName, lastName };
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h"
        });
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({
          message:
            "Unable to authenticate the user. Incorrect email or password"
        });
      }
    })
    .catch((error) =>
      res.status(500).json({ message: "Internal Server Error" })
    );
});

router.get(
  "/verify",
  // isAuthenticated,
  (req, res, next) => {
    //If JWT token is valid the payload gets decoded by the isAuthenticated middleware and made available on the req.payload
    console.log(`req.payload`, req.payload);

    //Send back the object with the user data previously set as the token payload
    res.status(200).json(req.payload);
  }
);

module.exports = router;
