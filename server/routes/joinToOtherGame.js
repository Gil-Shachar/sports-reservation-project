//#region : Imported Libraries
const express = require('express');
const router = express.Router();
const db = require('../database');
//#endregion

//#region Get Orders for Joining
// Route for retrieving open game orders that a user can join
router.post('/', (req, res) => {
  const { username, date, phone_number } = req.body;
  // Query to select open game orders with the possibility of joining
  db.query(
    `select open_games.*, a.joiner_username, a.status from (SELECT u.email AS host_email, u.name AS host_name, o.date_of_game, o.time_range, o.phone_number, o.weather_status, o.court_type, o.game_type, o.id
    FROM users u
    JOIN orders o ON u.phone_number = o.phone_number
    WHERE o.date_of_game > ? AND o.request_players = 'Yes' AND o.phone_number != ?
    ) AS open_games
    left join asks a on a.joiner_username = ? AND open_games.id = a.order_id ORDER BY open_games.date_of_game ASC
    `,
    [date, phone_number, username],
    (error, results) => {
      if (error) {
        console.error('Error retrieving user orders:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else if (results.length > 0) {
        res.json(results);
      } else {
        res.json([]);
      }
    }
  );
});
//#endregion
module.exports = router;
