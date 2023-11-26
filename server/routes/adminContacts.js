//#region : Imported Libraries adn Functions

const express = require('express');
const router = express.Router();
const db = require('../database');
const { sendEmail } = require('../SendMail');
//#endregion

//#region - Contacts
// Get all contact messages
router.get('/contacts', (req, res) => {
  db.query('SELECT * FROM contact_forms', (err, results) => {
    if (err) {
      console.log('Error retrieving contact messages:', err);
      res.status(500).send('Error retrieving contact messages');
    } else {
      res.json(results);
    }
  });
});
//#endregion

//#region : Reply to Contact Message
router.post('/reply', (req, res) => {
  const { id, reply } = req.body;
  // Update the reply for a contact message
  db.query(
    'UPDATE contact_forms SET reply = ?, reply_status = ? WHERE id = ?',
    [reply, 'Replied', id],
    (err, result) => {
      if (err) {
        console.log('Error updating reply:', err);
        res.status(500).send('Error updating reply');
      } else if (result) {
        console.log(`Updated reply for message ID ${id}`);

        // Get the user's email from the database using the message ID
        db.query(
          'SELECT email FROM contact_forms WHERE id = ?',
          [id],
          (err, emailResult) => {
            if (err) {
              console.log('Error retrieving user email:', err);
              res.status(500).send('Error retrieving user email');
            } else {
              const userEmail = emailResult[0].email;

              // Send email to the user
              const subject = 'Your message has been replied';
              const emailText = `Your message has been replied: ${reply}`;
              sendEmail(userEmail, subject, emailText);

              res.json({ message: `Updated reply for message ID ${id}` });
            }
          }
        );
      }
    }
  );
});
//#endregion

//#region :Delete Contact Message
router.post('/deleteContact', (req, res) => {
  const { id } = req.body;
  // Delete a contact message by ID
  db.query('DELETE FROM contact_forms WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error deleting requested Contact: ', err); // Change error to err
      res.status(500).json({ error: 'Error deleting requested Contact:' });
      return;
    }
    console.log('Contact deleted!');
    res.json({ success: true });
  });
});

//#endregion
module.exports = router;
