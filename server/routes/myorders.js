//#region : Imported Libraries
const express = require('express');
const router = express.Router();
const db = require('../database');
//#endregion

//#region : // Route for retrieving orders by phone number and date
router.post('/', (req, res) => {
  const phoneNumber = req.body.phone_number;
  const date = req.body.date;
  // Query to select orders by phone number and date
  db.query(
    'SELECT * FROM orders WHERE phone_number = ? AND date_of_game > ? ORDER BY date_of_game',
    [phoneNumber, date],
    (err, result) => {
      if (err) {
        req.setEncoding({ err: err });
      } else {
        if (result.length > 0) {
          console.log(result);
          res.send(result);
        } else {
          res.send({ message: 'no data for dat phone number' });
        }
      }
    }
  );
});
//#endregion

//#region : Route for updating the request_players field of an order
router.post('/updateRequestPlayer', (req, res) => {
  const { order_id, request_players } = req.body;
  // Update the request_players field of the specified order
  db.query(
    'UPDATE orders SET request_players = ? WHERE id = ?',
    [request_players, order_id],
    (err, result) => {
      if (err) {
        console.error('Error updating request player: ', error);
        res.status(500).json({ error: 'Error updating request player' });
        return;
      }
      console.log('Request player updated successfully!');
      res.json({ success: true });
    }
  );
});

//#endregion Update Request Player

//#region : Route for deleting an order
router.post('/deleteOrder', (req, res) => {
  const { order_id } = req.body;
  // Delete the specified order from the database
  db.query('Delete FROM orders WHERE id = ?', [order_id], (err, result) => {
    if (err) {
      console.error('Error deleting requested order: ', error);
      res.status(500).json({ error: 'Error updating request player' });
      return;
    }
    console.log('Order deleted!');
    res.json({ success: true });
  });
});
//#endregion
module.exports = router;
