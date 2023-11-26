//#region : Imported Libraries and Functions
const express = require('express');
const router = express.Router();
const { sendEmail } = require('../SendMail');
const db = require('../database');
const { hashPassword } = require('../PasswordHandle');
//#endregion

//#region : Route for user registration (sign-up)
router.post('/', async (req, res) => {
  const name = req.body.name;
  const last_name = req.body.last_name;
  const phone_number = req.body.phone_number;
  const email = req.body.email;
  const user_type = req.body.user_type;
  const date_of_birth = req.body.date_of_birth;
  const user_name = req.body.user_name;
  const password = req.body.password;
  const confirmpassword = req.body.confirmpassword;

  const params = [
    name,
    last_name,
    phone_number,
    email,
    user_type,
    date_of_birth,
    user_name,
    // Hash the password before storing it in the database
    await hashPassword(password),
  ];

  if (password === confirmpassword) {
    // Insert the new user into the database
    db.query(
      'INSERT INTO users (name, last_name, phone_number, email, user_type, date_of_birth, user_name, password) VALUES (?,?,?,?,?,?,?,?)',
      params,
      (err, result) => {
        if (err) {
          throw err;
        } else {
          console.log(`Inserted new user with ID ${result.insertId}`);
          // Send a welcome email to the new user
          sendEmail(
            email,
            'Sign up successfully!',
            `Hello ${name}, it is a pleasure to host you on our website, enjoy!`
          );
          res.send({ message: 'all good' });
        }
      }
    );
  } else {
    res.send({ message: 'password and confirmation do not match' });
  }
});

//#endregion

//#region :  Route for checking if username or phone number already exists
router.post('/check', async (req, res) => {
  const user_name = req.body.user_name;
  const phone_number = req.body.phone_number;

  // Check if username exists
  const existsUserName = await checkUserNameExists(user_name);

  // Check if phone number exists
  const existsPhoneNumber = await checkPhoneNumberExists(phone_number);

  res.json({ existsUserName, existsPhoneNumber });
});

// Function to check if username exists
const checkUserNameExists = (user_name) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT COUNT(*) as count FROM users WHERE user_name = ?',
      [user_name],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0].count > 0);
        }
      }
    );
  });
};

// Function to check if phone number exists
const checkPhoneNumberExists = (phone_number) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT COUNT(*) as count FROM users WHERE phone_number = ?',
      [phone_number],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0].count > 0);
        }
      }
    );
  });
};
//#endregion
module.exports = router;
