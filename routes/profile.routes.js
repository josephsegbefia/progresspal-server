const router = require("express").Router();
const Profile = require("../models/Profile.model");
const User = require("../models/User.model");

router.post("/profiles/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { occupation, location, avatarUrl, interests } = req.body;

    // Find the user by the ID

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    // Check if the user already has a profile
    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      profile = await Profile.create({
        user: userId,
        // firstName,
        // lastName,
        occupation,
        location,
        avatarUrl,
        interests
      });
    } else {
      // profile.firstName = firstName;
      // profile.lastName = lastName;
      profile.occupation = occupation;
      profile.location = location;
      profile.avatarUrl = avatarUrl;
      profile.interests = interests;
      await profile.save();
    }
    res.status(200).json({ profile });
  } catch (error) {
    consoel.log("Error setting up profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/profile/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ user: userId }).populate("user");
    const firstName = profile.user.firstName;
    const lastName = profile.user.lastName;
    const occupation = profile.occupation;
    const avatarUrl = profile.avatarUrl;
    const location = profile.location;
    const interests = profile.interests;

    res.json({
      firstName: firstName,
      lastName: lastName,
      occupation: occupation,
      avatarUrl: avatarUrl,
      location: location,
      interests: interests
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
