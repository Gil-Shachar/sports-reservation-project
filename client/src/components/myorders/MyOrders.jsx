//#region : Imported Modules
import React from 'react';
import styles from './myorders.module.css';
import { useState, useEffect } from 'react';
//#endregion

//#region : Function that shows the user all his Orders
function MyOrders() {
  //#region : Initialize state variables
  const [orders, setOrders] = useState([]);
  const [phone_number] = useState(sessionStorage.getItem('phone'));
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterOrder, setFilterOrder] = useState([]); // New state for filtered orders
  const [errorMessage, setErrorMessage] = useState('');
  const [date] = useState(new Date());
  //#endregion

  //#region : Fetch user's orders when the component mounts
  useEffect(() => {
    getMyOrders();
  }, []);
  //#endregion

  //#region : Function to fetch user's orders from the server
  async function getMyOrders() {
    // Fetch orders using a POST request
    fetch('http://localhost:5000/myOrders', {
      method: 'POST',
      phone_number: phone_number,
      body: JSON.stringify({ phone_number, date }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(async (orderData) => {
        if (orderData.length > 0) {
          // If orders are found, update the state
          console.log(orderData);
          setOrders(orderData);
          // Fetch join requests for orders with 'request_players' set to 'Yes'
          const ordersWithJoinRequests = orderData
            .filter((order) => order.request_players === 'Yes')
            .map((order) => order.id);

          // If there are join requests, fetch them and update the state
          const response = await fetch(
            'http://localhost:5000/order/join-requests',
            {
              method: 'POST',
              body: JSON.stringify(ordersWithJoinRequests),
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          const joinRequests = await response.json();
          for (const joinRequest of joinRequests) {
            const order = orderData.find(
              (order) => order.id === joinRequest.order_id
            );
            if (order.joinRequests) {
              order.joinRequests.push(joinRequest);
            } else {
              order.joinRequests = [joinRequest];
            }
          }
          setOrders(orderData);
          console.log('orderData', orderData);
        } else {
          console.log('No orders have been found');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
  //#endregion

  //#region : Function to update the 'request_players' field for an order
  function updateRequestPlayer(orderId, value) {
    fetch('http://localhost:5000/myOrders/updateRequestPlayer', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId, request_players: value }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Handle the response as needed
        console.log(data);
        getMyOrders(data); // Refresh the orders after updating
      })
      .catch((err) => {
        console.error(err);
        console.log('Error updating request player');
      });
  }
  //#endregion

  //#region : Function to delete an order
  function deleteOrder(orderId) {
    fetch('http://localhost:5000/myOrders/deleteOrder', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Handle the response as needed
        console.log(data);
        getMyOrders(); // Refresh the orders after deleting
      })
      .catch((err) => {
        console.error(err);
        console.log('Error deleting order');
      });
  }
  //#endregion

  //#region : Function to update the status of a join request
  async function updateAskStatus(joinRequest, status) {
    const response = await fetch(
      'http://localhost:5000/order/update-join-request',
      {
        method: 'PUT',
        body: JSON.stringify({ ...joinRequest, status }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    console.log(data);
    if (response.status === 200) {
      alert(data.message);
    } else {
      alert(data.message);
    }
  }
  //#endregion

  //#region :  Filter orders based on selected date range
  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      setErrorMessage('Start date cannot be after end date.');
      setFilterOrder([]); // Set an empty array to clear the table
    } else {
      setErrorMessage('');
      const filteredOrders = orders.filter((order) => {
        if (startDate && endDate) {
          const orderDate = new Date(order.date_of_game);
          return (
            orderDate >= new Date(startDate) && orderDate <= new Date(endDate)
          );
        }
        return true;
      });
      setFilterOrder(filteredOrders);
    }
  }, [orders, startDate, endDate]);
  //#endregion

  //#region : Return the JSX for rendering the component
  return (
    <div className={styles.container}>
      <div className={styles.MyOrderH1}>
        <h1>My Orders - {sessionStorage.getItem('name')}</h1>
      </div>
      <p className={styles.par1}>
        Please select a date range so that you can see your orders in
        the requested range!
      </p>
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
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      <div className={styles.order_scroller}>
        <table className={styles.orderstable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time Range</th>
              <th>Order ID</th>
              <th>Phone Number</th>
              <th>Payment Status</th>
              <th>Payment Sum</th>
              <th>Weather Status</th>
              <th>Court Type</th>
              <th>Game Type</th>
              <th>Invite Players</th>
              <th>Update Invitations</th>
              <th>Cancel Order</th>
            </tr>
          </thead>
          <tbody>
            {filterOrder.map((order) => (
              <React.Fragment key={order.id}>
                <tr>
                  <td>
                    {new Date(order.date_of_game).toLocaleDateString('en-GB')}
                  </td>
                  <td>{order.time_range}</td>
                  <td>{order.id}</td>
                  <td>{order.phone_number}</td>
                  <td>{order.payment_status}</td>
                  <td>{order.payment_sum}</td>
                  <td>{order.weather_status}</td>
                  <td>{order.court_type}</td>
                  <td>{order.game_type}</td>
                  <td>{order.request_players}</td>
                  <td>
                    <button
                      className={styles.inviteBtn}
                      onClick={() => updateRequestPlayer(order.id, 'Yes')}
                    >
                      Invite players
                    </button>
                    <button
                      className={styles.cancelInviteBtn}
                      onClick={() => updateRequestPlayer(order.id, 'No')}
                    >
                      Cancel invite
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.deleteOrderBtn}
                      onClick={() => deleteOrder(order.id)}
                    >
                      Delete order
                    </button>
                  </td>
                </tr>
                {order.joinRequests && order.joinRequests.length > 0 ? (
                  <tr>
                    <td style={{ paddingLeft: '80px' }} colSpan='12'>
                      Join requests:
                      {order.joinRequests.map((joinRequest) => (
                        <div key={joinRequest.id}>
                          {joinRequest.joiner_username}{' '}
                          <button
                            className={styles.approvebtn}
                            onClick={() =>
                              updateAskStatus(joinRequest, 'Approved')
                            }
                          >
                            Approve
                          </button>
                          <button
                            className={styles.declinebtn}
                            onClick={() =>
                              updateAskStatus(joinRequest, 'Declined')
                            }
                          >
                            Decline
                          </button>
                          {joinRequest.status}
                        </div>
                      ))}
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  //#endregion
}
//#endregion

export default MyOrders;
