//#region : Imported Libraries
const bcrypt = require('bcrypt');
//#endregion

//#region : Function to hash the password
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
}
//#endregion

//#region : Function to compare password with hashed password

async function comparePassword(password, hashedPassword) {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
}
//#endregion
module.exports = {
  hashPassword,
  comparePassword,
};
