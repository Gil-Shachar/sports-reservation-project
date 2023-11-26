//#region : Imported Libraries adn Functions
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { sendEmail } = require('../SendMail');
const db = require('../database');
const { hashPassword } = require('../PasswordHandle');
//#endregion

//#region :Password Reset Route
router.post('/password-reset', async (req, res) => {
  const user_name = req.body.user_name;

  // Generate a random password
  const randomPassword = Math.random().toString(36).slice(-8);

  const params = [await hashPassword(randomPassword), user_name];
  // Update the user's password in the database with the new hashed password
  db.query(
    'UPDATE users SET password=? WHERE user_name=?',
    params,
    (err, result) => {
      if (err) {
        throw err;
      } else {
        console.log(`Inserted new user with ID ${result.insertId}`);
        // Retrieve the user's email from the database
        db.query(
          'SELECT email FROM users WHERE user_name = ?',
          [user_name],
          (err, result) => {
            if (err) {
              console.log('Error retrieving data:', err);
            } else {
              console.log(`Retrieved email ${result[0].email}`);
              // Send an email with the new password to the user
              sendEmail(
                result[0].email,
                'Password reset',
                `Hello ${user_name}, your new password is ${randomPassword}`
              );
            }
          }
        );
        res.send({ message: 'all good' });
      }
    }
  );
});
//#endregion Sign-up Route
module.exports = router;
