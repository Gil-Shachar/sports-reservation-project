//#region : Imported Modules
import React, { useState, useEffect } from 'react';
import styles from './joinToOtherGame.module.css';
//#endregion

//#region : function that takes care of users joining to other users games reservation
function JoinToOtherGame() {
  //#region : set State variables
  const [orders, setOrders] = useState([]);
  const [username] = useState(sessionStorage.getItem('user_name'));
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredGames, setFilteredGames] = useState([]); // New state for filtered orders
  const [errorMessage, setErrorMessage] = useState('');
  const [date] = useState(new Date());
  const [phone_number] = useState(sessionStorage.getItem('phone'));
  //#endregion

  //#region :Fetch available games with requested joiners on component mount
  useEffect(() => {
    fetchOrdersWithRequestedJoiners();
  }, []);
  //#endregion

  //#region : Function to fetch available games with requested joiners
  function fetchOrdersWithRequestedJoiners() {
    fetch('http://localhost:5000/get-available-games-to-join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, phone_number, date }),
    })
      .then((res) => {
        if (res.ok) {
          // Check if the response status is OK (200-299)
          return res.json(); // Parse the JSON response
        } else {
          throw new Error('Failed to fetch orders'); // Throw an error if the response status is not OK
        }
      })
      .then((data) => {
        if (data.length > 0) {
          console.log(data);
          // Update the 'name' state for each order
          const updatedOrders = data.map((order) => ({
            ...order,
            name: order.host_name, // Assuming 'host_name' is the correct field containing the name
          }));
          setOrders(updatedOrders);
        } else {
          console.log('No orders have been found');
        }
      })
      .catch((err) => {
        console.error(err);
        console.log('Error fetching orders');
      });
  }
  //#endregion

  //#region : Function to handle joining a game
  const handleJoinGame = async (orderId) => {
    const payload = {
      order_id: orderId,
      joiner_username: sessionStorage.getItem('user_name'),
    };
    console.log('payload', payload);

    const response = await fetch('http://localhost:5000/order/join', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      console.log('Request sent successfully');
      fetchOrdersWithRequestedJoiners();
    } else {
      console.log('Error sending request');
    }
  };
  //#endregion

  //#region : Update the filteredGames state based on date range
  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      setErrorMessage('Start date cannot be after end date.');
      setFilteredGames([]); // Set an empty array to clear the table
    } else {
      setErrorMessage('');
      const filteredGames = orders.filter((order) => {
        if (startDate && endDate) {
          const gameDate = new Date(order.date_of_game);
          return (
            gameDate >= new Date(startDate) && gameDate <= new Date(endDate)
          );
        }
        return true;
      });
      setFilteredGames(filteredGames);
    }
  }, [orders, startDate, endDate]);
  //#endregion

  //#region : Render the component
  return (
    <div>
      <h1 className={styles.h1}>Join other players!</h1>
      <p className={styles.p1}>
        Here you can ask to join other games, feel free to ask hosts
      </p>
      {/* {date range input} */}
      <div className={styles.dateRangeContainer}>
        <input
          type='date'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type='date'
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      {/* Display Error Message if Present */}
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      {/* Table Container */}
      <div className={styles.tableScroller}>
        {/* Game Table */}
        <table
          className={styles.joinTable}
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            overflow: 'auto',
            maxHeight: 'calc(85.8vh - 200px)',
            border: '1px solid black',
            marginTop: '10px',
          }}
        >
          {/* Table Header */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Date of Game</th>
              <th>Time Range</th>
              <th>Phone Number</th>
              <th>Weather Status</th>
              <th>Court Type</th>
              <th>Game Type</th>
              <th>Join Game</th>
              <th>Request Status</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {filteredGames.map((order, index) => {
              console.log(order);
              return (
                <tr key={index}>
                  <td>{order.name}</td>
                  <td>
                    {new Date(order.date_of_game).toLocaleDateString('en-GB')}
                  </td>
                  <td>{order.time_range}</td>
                  <td>{order.phone_number}</td>
                  <td>{order.weather_status}</td>
                  <td>{order.court_type}</td>
                  <td>{order.game_type}</td>
                  <td>
                    {/* Display "Waiting for Response" if the game status is 'open' */}
                    {order.status === 'open' ? (
                      <span>Waiting for Response</span>
                    ) : (
                      <span>{order.status}</span>
                    )}
                    {!order.status && (
                      // Display "Ask to join" button if there's no status (user can request to join)
                      <button
                        className={styles.joinGame}
                        disabled={order.request_status === 'RequestSent'}
                        onClick={() => handleJoinGame(order.id)}
                      >
                        Ask to join
                      </button>
                    )}
                  </td>
                  {/* Request Status */}
                  <td>
                    {/* Display "Requested" if joiner_username exists, else "No Request Sent" */}
                    {order.joiner_username ? 'Requested' : 'No Request Sent'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
  //#endregion
}
//#endregion
export default JoinToOtherGame;
