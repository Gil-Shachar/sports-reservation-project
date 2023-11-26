//#region : Imported Libraries and Functions
const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcrypt');
const { hashPassword } = require('../PasswordHandle');
//#endregion

//#region : Route for updating user profile information
router.post('/updateMyProfile', (req, res) => {
  const name = req.body.name;
  const last_name = req.body.last_name;
  const phone_number = req.body.phone_number;
  const email = req.body.email;
  const date_of_birth = req.body.date_of_birth;
  const user_name = req.body.user_name;
  // Update the user's profile information in the database
  db.query(
    `UPDATE users
    SET name = ?, last_name = ?, phone_number = ?, email = ?, date_of_birth = ?, 
    user_name = ? 
     WHERE phone_number = ?`,
    [
      name,
      last_name,
      phone_number,
      email,
      date_of_birth,
      user_name,
      phone_number,
    ],
    (err, result) => {
      if (err) {
        console.log('error updating the input values');
        throw err;
      } else if (result.affectedRows > 0) {
        console.log('Profile updated successfully');
        res.json({ message: 'Profile updated successfully' });
      } else {
        console.log('No rows affected');
        res.json({ message: 'No rows affected' });
      }
    }
  );
});
//#endregion Update My Profile

//#region : Route for updating user password
router.post('/updatepassword', async (req, res) => {
  const newPassword = req.body.newPassword;
  const confirmnewpassword = req.body.confirmnewpassword;
  const phone_number = req.body.phone_number;
  const hashedNewPassword = await hashPassword(confirmnewpassword);
  // Hash the new password before updating it in the database
  db.query(
    `UPDATE users
    SET password=?
     WHERE phone_number = ?`,
    [hashedNewPassword, phone_number],
    (err, result) => {
      if (err) {
        console.log('backend error updating password');
        throw err;
      } else if (result && newPassword === confirmnewpassword) {
        console.log('backend changed password succesfully');
        res.json({ message: 'Password updated successfully' });
      } else {
        res.json({ message: 'Password updated failed' });
      }
    }
  );
});
//#endregion Update Password
module.exports = router;
