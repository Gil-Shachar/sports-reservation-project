//#region : Imported Libraries
const express = require('express');
const router = express.Router();
const db = require('../database');
//#endregion

//#region :  Route for submitting a contact form
router.post('/', (req, res) => {
  const { user_name, email, subject, message } = req.body;
  // Insert contact form data into the database
  db.query(
    'INSERT INTO contact_forms (user_name,email,subject, message) VALUES (?,?,?,?)',
    [user_name, email, subject, message],
    (err, result) => {
      if (err) {
        console.log('Error inserting data:', err);
        res.status(500).send('Error inserting data');
      } else {
        console.log(`Inserted new contact record with ID ${result.insertId}`);
        res.json({ message: `Inserted new contact record ${result.insertId}` });
      }
    }
  );
});
//#endregion

//#region : Route for retrieving contact messages for a specific user
router.post('/getMessages', (req, res) => {
  const user_name = req.body.user_name;
  if (user_name) {
    // Retrieve contact messages for the specified user
    db.query(
      'SELECT * FROM contact_forms WHERE user_name = ?',
      [user_name],
      (err, result) => {
        if (err) {
          console.error('Error retrieving contact messages:', err);
          return res
            .status(500)
            .json({ error: 'Error retrieving contact messages' });
        } else {
          if (result.length > 0) {
            res.send(result);
          } else {
            res.send({ message: 'no data for user name' });
          }
        }
      }
    );
  } else {
    res.status(400).json({ error: 'Missing user_name parameter' });
  }
});
//#endregion
module.exports = router;
