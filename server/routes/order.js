//#region : Imported librarys and functions
const express = require('express');
const router = express.Router();
const { sendEmail } = require('../SendMail');
const db = require('../database');
//#endregion

//#region :Handle POST requests to the root path ('/')
router.post('/', (req, res) => {
  // Extract request body data using destructuring
  const {
    date_of_game,
    time_range,
    phone_number,
    payment_status,
    payment_sum,
    weather_status,
    court_type,
    game_type,
    request_players,
    email,
  } = req.body;
  // Extract start and end times from time_range
  const startTime = time_range[0];
  const endTime = time_range[1];
  const formattedTimeRange = `${startTime} - ${endTime}`;
  // Check the value of the 'action' query parameter to determine the action
  if (req.query.action === 'check') {
    // Handle a check action to query orders based on date and time range
    db.query(
      'SELECT * FROM orders WHERE date_of_game=? AND time_range=?',
      [date_of_game, formattedTimeRange],
      (err, result) => {
        if (err) {
          console.log('Error from db');
          res.status(500).send('Error querying data');
        } else if (result.length >= 0) {
          console.log(result);
          res.send(result);
        } else {
          console.log('Data does not exist in the database');
          res.send([]);
        }
      }
    );
  } else if (req.query.action === 'insert') {
    // Handle an insert action to insert a new order into the database

    // Check if the court type is a half court
    if (court_type === 'Half Court') {
      console.log('half court', court_type);
      payment_sum = 100; // Set the price for half court
      //Query the database to count the number of orders for half court at the specified date and time range
      db.query(
        'SELECT COUNT(*) as count FROM orders WHERE date_of_game=? AND time_range=? AND court_type=?',
        [date_of_game, formattedTimeRange, 'Half court'],

        (err, result) => {
          if (err) {
            console.log('Error from db');
            res.status(500).send('Error querying data');
          } else {
            const count = result[0].count;
            if (count >= 2) {
              console.log('Cannot insert more than 2 people for half court');
              res
                .status(400)
                .send('Cannot insert more than 2 people for half court');
            } else {
              insertOrder();
            }
          }
        }
      );
    } else if (court_type === 'Full Court') {
      console.log('full court', court_type);
      payment_sum = 200; // Set the price for full court
    }

    insertOrder(); // Insert the new order
  } else {
    res.status(400).send('Invalid action');
  }
  //#endregion

  //#region : Function to insert an order into the database
  function insertOrder() {
    // Insert order data into the 'orders' table
    db.query(
      'INSERT INTO orders (date_of_game, time_range, phone_number,payment_status, payment_sum, weather_status,court_type, game_type, request_players) VALUES (?,?,?,?,?,?,?,?,?)',
      [
        date_of_game,
        formattedTimeRange,
        phone_number,
        payment_status,
        payment_sum,
        weather_status,
        court_type,
        game_type,
        request_players,
      ],
      (err, result) => {
        if (err) {
          console.log('Error inserting data:', err);
          res.status(500).send('Error inserting data');
        } else {
          console.log(`Inserted new Order with ID ${result.insertId}`);
          // Send an email notification about the new order
          sendEmail(
            email,
            `New order has been added!`,
            `Date : ${date_of_game}\nTime range : ${startTime} - ${endTime}`
          );
          res.send(`Inserted new Order with ID ${result.insertId}`);
        }
      }
    );
  }
});
//#endregion

//#region Closest Order Route : retrieves the closest order for a given phone number and date, ordering the results by date and time.
router.post('/myClosestOrder', (req, res) => {
  const phoneNumber = req.body.phone_number;
  const date = req.body.date;
  db.query(
    'SELECT * FROM orders WHERE phone_number = ? AND date_of_game > ? ORDER BY date_of_game ASC LIMIT 1',
    [phoneNumber, date],
    (err, result) => {
      if (err) {
        console.error('Error retrieving closest order:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else if (result.length > 0) {
        res.json(result);
      } else {
        res.json([]);
      }
    }
  );
});
//#endregion

//#region : retrieves orders for a specific date and joins them with user data to provide a detailed list of orders for that day.
router.get('/day', (req, res) => {
  const date = req.query.date;
  db.query(
    `SELECT orders.*, users.name, users.last_name FROM orders 
    JOIN users ON orders.phone_number = users.phone_number
    WHERE date_of_game = ?
    `,
    [date],
    (err, result) => {
      if (err) {
        console.error('Error retrieving closest order:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else if (result.length > 0) {
        res.json(result);
      } else {
        res.json([]);
      }
    }
  );
});
//#endregion

//#region : Handle Join Request
router.post('/join', (req, res) => {
  const { order_id, joiner_username } = req.body;
  // Insert a new join request into the 'asks' table
  db.query(
    'INSERT INTO asks (order_id, joiner_username) VALUES (?,?)',
    [order_id, joiner_username],
    (err, result) => {
      if (err) {
        console.log('Error inserting data:', err);
        res.status(500).send('Error inserting data');
      } else {
        console.log(`Inserted new ask record with ID ${result.insertId}`);
        res.json({ message: `Inserted new ask record ${result.insertId}` });
      }
    }
  );
});
//#endregion

//#region : Retrieve Join Requests
router.post('/join-requests', (req, res) => {
  const orderIds = req.body;
  // If no order IDs provided, return an empty response
  if (orderIds.length === 0) {
    res.json([]);
    return;
  }
  // Retrieve join requests from the 'asks' table based on order IDs and status
  db.query(
    `SELECT * FROM asks WHERE order_id IN (${orderIds.join(
      ','
    )}) AND status != 'Approved' AND status != 'Declined'`,
    [],
    (err, result) => {
      if (err) {
        console.error('Error retrieving join requests:', err);
        res.status(500).json({ error: 'Internal server error' });
      } else if (result.length > 0) {
        res.json(result);
      } else {
        res.json([]);
      }
    }
  );
});
//#endregion

//#region : Update Join Request Status
router.put('/update-join-request', (req, res) => {
  const { id, order_id, joiner_username, status } = req.body;
  // Update the status of a join request in the 'asks' table
  db.query(
    'UPDATE asks SET status = ? WHERE id = ?',
    [status, id],
    (err, result) => {
      if (err) {
        console.log('Error updating data:', err);
        res.status(500).json({ message: 'Error updating data' });
      } else {
        console.log(`Updated ask with ID ${id}`);

        res.json({ message: `${status} successfully` });
        // Retrieve the email of the joiner
        db.query(
          'SELECT email FROM users WHERE user_name = ?',
          [joiner_username],
          (err, result) => {
            if (err) {
              console.log('Error retrieving data:', err);
            } else {
              console.log(`Retrieved email ${result[0].email}`);
              sendEmail(
                result[0].email,
                `Your request to join a game has been approved!`,
                `Your request to join game order ${order_id} has been approved!`
              );
            }
          }
        );
      }
    }
  );
});
//#endregion

//#region : Update Payment Status
router.post('/update-payment-status', (req, res) => {
  const { payment_status, time_range, date_of_game } = req.body;
  const startTime = time_range[0];
  const endTime = time_range[1];
  const formattedTimeRange = `${startTime} - ${endTime}`;
  // Update payment status in the 'orders' table based on PayPal payment status
  db.query(
    'UPDATE orders SET payment_status = ? WHERE  time_range = ? AND date_of_game = ?',
    [payment_status, formattedTimeRange, date_of_game], // Update payment_status based on PayPal payment status
    (err, result) => {
      if (err) {
        console.log('Error updating payment status:', err);
        res.status(500).send('Error updating payment status');
      } else {
        console.log(
          'Payment status updated for payment status :  ',
          payment_status
        );
        res.json({ message: 'Payment status updated successfully' });
      }
    }
  );
});
//#endregion
module.exports = router;
