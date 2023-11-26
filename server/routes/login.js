//#region : Imported Libraries
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../database');
//#endregion

//#region : Route for user login
router.post('/', (req, res) => {
  const user_name = req.body.user_name;
  const password = req.body.password;

  // Check if the user is not blocked
  db.query(
    'SELECT * FROM users WHERE user_name=? AND is_Blocked= ?',
    [user_name, 'Not Blocked'],
    async (err, result) => {
      console.log('result', result);
      if (err) {
        res.status(500).json({ error: err });
      } else {
        if (result.length > 0) {
          const user = result[0];

          // Compare the provided password with the stored hashed password
          const isValid = await bcrypt.compare(password, user.password);
          console.log('password', password);
          console.log('isValid', isValid);
          if (isValid) {
            // If the password is valid, send the user data
            res.send(result);
          } else {
            // If the password is invalid, send an error message
            res.send({ message: 'wrong username or password' });
          }
        } else {
          // If the user is not found, send an error message
          res.send({ message: 'User not found' });
        }
      }
    }
  );
});
//#endregion
module.exports = router;
