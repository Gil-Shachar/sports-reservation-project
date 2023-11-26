//#region : Imported Libraries
const express = require('express');
const router = express.Router();
const db = require('../database');
//#endregion

//#region :Route for generating reports based on date range
router.post('/', (req, res) => {
  const { startDate, endDate } = req.body;
  // Query to retrieve game type data within the specified date range
  const gameTypeQuery = `
    SELECT game_type, COUNT(*) AS game_type_count
    FROM orders
    WHERE date_of_game BETWEEN ? AND ?
    GROUP BY game_type
  `;
  // Query to retrieve court type data within the specified date range
  const courtTypeQuery = `
    SELECT court_type, COUNT(*) AS court_type_count
    FROM orders
    WHERE date_of_game BETWEEN ? AND ?
    GROUP BY court_type
  `;
  // Query to retrieve time range data within the specified date range
  const timeRangeQuery = `SELECT CASE
       WHEN HOUR(time_range) BETWEEN 8 AND 9 THEN '08:00 - 10:00'
       WHEN HOUR(time_range) BETWEEN 10 AND 11 THEN '10:00 - 12:00'
       WHEN HOUR(time_range) BETWEEN 12 AND 13 THEN '12:00 - 14:00'
       WHEN HOUR(time_range) BETWEEN 14 AND 15 THEN '14:00 - 16:00'
       WHEN HOUR(time_range) BETWEEN 16 AND 17 THEN '16:00 - 18:00'
       WHEN HOUR(time_range) BETWEEN 18 AND 19 THEN '18:00 - 20:00'
       WHEN HOUR(time_range) BETWEEN 20 AND 21 THEN '20:00 - 22:00'
      ELSE 'Other'
      END AS time_range,
      COUNT(*) AS order_count
      FROM orders
      WHERE date_of_game BETWEEN ? AND ?
      GROUP BY time_range`;
  // Execute the gameTypeQuery to fetch game type data

  db.query(
    gameTypeQuery,
    [startDate, endDate],
    (errGameType, gameTypeResults) => {
      if (errGameType) {
        console.error(errGameType);
        res
          .status(500)
          .json({ message: 'Error fetching game type data for reports' });
      } else {
        // Execute the courtTypeQuery to fetch court type data
        db.query(
          courtTypeQuery,
          [startDate, endDate],
          (errCourtType, courtTypeResults) => {
            if (errCourtType) {
              console.error(errCourtType);
              res.status(500).json({
                message: 'Error fetching court type data for reports',
              });
            } else {
              // Execute the timeRangeQuery to fetch time range data
              db.query(
                timeRangeQuery,
                [startDate, endDate],
                (errTimeRange, timeRangeResults) => {
                  if (errTimeRange) {
                    console.error(errTimeRange);
                    res.status(500).json({
                      message: 'Error fetching time range data for reports',
                    });
                  } else {
                    // Send the collected data as a JSON response
                    res.json({
                      gameTypeData: gameTypeResults,
                      courtTypeData: courtTypeResults,
                      timeRangeData: timeRangeResults,
                    });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});
//#endregion
module.exports = router;
