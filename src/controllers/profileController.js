const { validateEditProfileData } = require("../utils/validation");

exports.view = async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};

exports.edit = async (req, res) => {
  try {
    const data = req.body;

    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills can't be more then 10");
    }

    const loggedInUser = req.user;

    Object.keys(data).forEach((key) => (loggedInUser[key] = data[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
};
