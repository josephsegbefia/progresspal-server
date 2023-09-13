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
        occupation,
        location,
        avatarUrl,
        interests
      });
    } else {
      profile.firstName = user.firstName;
      profile.lastName = user.lastName;
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
module.exports = router;
