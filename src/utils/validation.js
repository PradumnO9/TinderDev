const validator = require("validator");

const validateSignUpData = (firstName, lastName, emailId, password) => {
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("EmailId is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

module.exports = { validateSignUpData };
