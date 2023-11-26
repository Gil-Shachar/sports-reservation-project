//#region : Imported Libraries
const express = require('express');
const router = express.Router();
const db = require('../database');
//#endregion

//#region - dashboard
// Update weather status for orders within a specified date range
router.post('/weather', (req, res) => {
  const start_day = req.body.bad_weather_begin;
  const end_day = req.body.bad_weather_end;

  // Update weather status to 'Bad' for orders within the specified date range
  db.query(
    "UPDATE orders SET weather_status = 'Bad' WHERE date_of_game BETWEEN ? AND ?",
    [start_day, end_day],
    (err, result) => {
      if (err) {
        res.send({ message: 'Error accured' });
      } else {
        res.send(result);
      }
    }
  );
});

//#endregion
module.exports = router;
