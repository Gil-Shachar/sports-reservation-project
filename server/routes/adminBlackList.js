//#region : Imported Libraries
const express = require('express');
const router = express.Router();
const db = require('../database');
//#endregion
//#region : Get All Orders (Filtered by Block Status)
router.post('/', (req, res) => {
  const { is_blocked } = req.body;
  if (is_blocked === 'Not Blocked' || is_blocked === 'Blocked') {
    // Retrieve orders with user details
    db.query(
      `SELECT
          o.id AS id,
          o.date_of_game,
          o.time_range,
          DATE_FORMAT(CONCAT(o.date_of_game, ' ', o.time_range), '%Y-%m-%d %H:%i:%s') AS datetime,
          o.weather_status,
          u.user_name,
          u.phone_number,
          u.is_blocked
      FROM
          orders o
      JOIN
          users u ON o.phone_number = u.phone_number;`,
      (err, result) => {
        if (err) {
          console.log('error blocklist', err);
          res.send(err);
        } else {
          console.log('block list success');

          // Sort the fetched data by closest datetime (date and time range)
          const sortedData = result.sort((a, b) => {
            const aDatetime = new Date(a.datetime);
            const bDatetime = new Date(b.datetime);
            return aDatetime - bDatetime;
          });

          res.send(sortedData);
        }
      }
    );
  } else {
    res.json([]);
  }
});
//#endregion

//#region Get Blocked Users
router.post('/getblocktable', (req, res) => {
  const { is_blocked } = req.body;

  if (is_blocked === 'Blocked') {
    db.query(
      'SELECT * FROM users WHERE is_blocked = ?',
      [is_blocked],
      (err, result) => {
        if (err) {
          console.log('Error fetching blocked users:', err);
          res.status(500).json({
            message: 'An error occurred while fetching blocked users.',
          });
        } else {
          console.log('Blocked users fetched successfully.');
          res.json(result);
        }
      }
    );
  } else {
    res.json([]);
  }
});
//#endregion

//#region Get Unblocked Users
router.post('/unblock', (req, res) => {
  const { phone_number } = req.body;
  // Unblock a user by updating their is_blocked status
  db.query(
    'UPDATE users SET is_blocked = ? WHERE phone_number = ?',
    ['Not Blocked', phone_number],
    (err, result) => {
      if (err) {
        console.log('Error unblocking user:', err);
        res
          .status(500)
          .json({ message: 'An error occurred while unblocking the user.' });
      } else {
        console.log('User unblocked successfully.', result);
        res.json({ message: 'User unblocked successfully.' });
      }
    }
  );
});
//#endregion

//#region Blocked users
router.post('/block', (req, res) => {
  const { phone_number } = req.body;
  // Block a user by updating their is_blocked status
  db.query(
    'UPDATE users SET is_blocked = ? WHERE phone_number = ? ',
    ['Blocked', phone_number],
    (err, result) => {
      if (err) {
        console.log('Error blocking user:', err);
        res
          .status(500)
          .json({ message: 'An error occurred while blocking the user.' });
      } else {
        console.log('User blocked successfully.', result);

        // Delete the user's orders
        db.query(
          'DELETE FROM orders WHERE phone_number = ?',
          [phone_number],
          (err, deleteResult) => {
            if (err) {
              console.log('Error deleting orders:', err);
              // Handle the error as needed
            } else {
              console.log('Orders deleted successfully.');
            }
            res.json({ message: 'User blocked successfully.' });
          }
        );
      }
    }
  );
});
//#endregion

//#region :: Get Blocked Users by Phone Number
router.post('/blockedusers', (req, res) => {
  const { phone_number, is_blocked } = req.body;
  // Retrieve blocked users by phone number
  db.query(
    'SELECT * FROM users WHERE phone_number=? AND is_blocked=?',
    [phone_number, 'Blocked'],
    (err, result) => {
      if (err) {
        res.status(500).send('error from BE ');
      } else {
        console.log('BE IS OK');
        res.send(result);
      }
    }
  );
});
//#endregion
module.exports = router;
