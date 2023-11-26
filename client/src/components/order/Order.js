//#region : Imported Modules
import React, { useState, useEffect } from 'react';
import Times from './Times';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './order.modules.css';
import PayPal from './PayPal';
import { PayPalScriptProvider } from '@paypal/react-paypal-js'; // Import PayPal components
//#endregion

//#region : function that  making a reservation
function Order() {
  //#region : intilize use state
  const [orders, setOrders] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showTime, setShowTime] = useState(false);
  const [dateOfGame, setDateOfGame] = useState('');
  const [timeRange, setTimeRange] = useState([]);
  const [nonAvailableTimes, setNonAvailableTimes] = useState([]);
  const [availableSlot, setAvailableSlots] = useState([]);
  const [phone_number] = useState(sessionStorage.getItem('phone'));
  const [errorMessage, setErrorMessage] = useState('');
  const [email] = useState(sessionStorage.getItem('email'));
  const [payment_status, setpayment_status] = useState('');
  const [payment_sum, setPayment_sum] = useState('');
  const [weather_status] = useState('Good');
  const [courtType, setCourtType] = useState('');
  const [game_type, setgame_type] = useState('');
  const [request_players] = useState('No');
  const [checkout, setCheckOut] = useState(false);
  const [completedPayPalPayment, setCompletedPayPalPayment] = useState(false);
  const [order_id] = useState('');

  //#endregion

  //#region Inputs Validations
  const validateInputs = () => {
    if (!dateOfGame) {
      setErrorMessage('Please select a date of game.');
      return false;
    }

    if (!timeRange || timeRange.length !== 2) {
      setErrorMessage('Please select a valid time range.');
      return false;
    }

    if (!courtType) {
      setErrorMessage('Please select a court type.');
      return false;
    }

    if (!game_type) {
      setErrorMessage('Please select a game type.');
      return false;
    }

    return true;
  };
  //#endregion

  //#region : Handle selection of time range
  const handleTimeSelect = (selectedTime) => {
    setTimeRange(selectedTime);
  };
  //#endregion

  //#region :Fetch user's closest order on component mount
  useEffect(() => {
    sendMyClosestOrder();
  }, []);
  //#endregion

  //#region : Function to fetch user's closest order
  function sendMyClosestOrder() {
    // Make a request to fetch user's closest order
    fetch('http://localhost:5000/order/myClosestOrder', {
      method: 'POST',
      phone_number: phone_number,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone_number, date }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          console.log(data);
          setOrders(data);
        } else {
          console.log('No orders have been found');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
  //#endregion

  //#region : Handle selection of court type
  const handleCourtTypeSelect = (event) => {
    // Handle selection of court type
    const courtType = event.target.value;
    setCourtType(courtType);
    // Update the court price based on the selected court type
    if (courtType === 'half_court') {
      setPayment_sum(30);
    } else if (courtType === 'full_court') {
      setPayment_sum(60);
    } else {
      setPayment_sum(''); // Reset payment_sum if no court type is selected
    }
    if (payment_status !== 'paid') {
      setpayment_status('NotPaid');
    }

    getAvailableSlots();
  };
  //#endregion

  //#region :Handle order submission
  const handleOrderSubmit = (event) => {
    event.preventDefault();
    // check if inputs valid
    if (!validateInputs()) {
      return;
    }
    setErrorMessage('');
    const paymentStatus = completedPayPalPayment ? 'payed' : 'Notpayed';

    // Handle check
    fetch('http://localhost:5000/order?action=check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date_of_game: dateOfGame,
        time_range: timeRange,
        court_type: courtType, // Include court type in the request body
        payment_status: paymentStatus,
        // Set payment_status based on PayPal payment completion
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Error checking data');
        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          // Check if the existing orders have the same court type
          const sameCourtTypeOrders = data.filter(
            (order) => order.court_type === courtType
          );

          if (sameCourtTypeOrders.length >= 2) {
            // Court type limitation reached
            console.log('Court type limitation reached');
            // Handle the case where the court type limitation is reached (display error message, etc.)
          } else {
            // Court type limitation not reached, proceed with insertion
            insertOrderData();
          }
        } else {
          // Data does not exist in the database, proceed with insertion
          insertOrderData();
        }
      })

      .catch((error) => {
        console.error(error);
      });
  };
  //#endregion

  //#region :Function to insert order data
  const insertOrderData = () => {
    fetch('http://localhost:5000/order?action=insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date_of_game: dateOfGame,
        time_range: timeRange,
        order_id: order_id,
        phone_number: phone_number,
        payment_status: payment_status,
        payment_sum: payment_sum,
        weather_status: weather_status,
        court_type: courtType,
        game_type: game_type,
        request_players: request_players,
        email: email,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Error inserting data');
        } else {
          console.log(response);

          setErrorMessage('New order has been added!');
          await fetchDateData(dateOfGame);
          getAvailableSlots();
        }
      })
      .catch((error) => {
        console.error(error);
        // Display an error message to the user
        alert('Error placing the order. Please try again.');
      });
  };
  //#endregion

  //#region :Handle day click in the calendar
  const handleDayClick = async (data) => {
    const currentDate = new Date();
    const selectedDate = new Date(data);

    if (selectedDate < currentDate) {
      return;
    }

    const date = selectedDate.toLocaleDateString('en-CA');
    setDateOfGame(date);
    setShowTime(true);

    await fetchDateData(date);
  };
  //#endregion

  //#region : return component
  return (
    <div>
      <div className='app'>
        <h1 className='orderh1'>
          Hello {sessionStorage.getItem('name')}, Welcome To Our Reservation
          Website
        </h1>
        <p className='orderp'>
          In this table you can see your colosest reservation
        </p>
        <div className='orders-table-container'>
          <table className='orders-table'>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time Range</th>
                <th>Phone Number</th>
                <th>Payment Status</th>
                <th>Payment Sum</th>
                <th>Weather Status</th>
                <th>Court Type</th>
                <th>Game Type</th>
                <th>Invite Players</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td>
                    {new Date(order.date_of_game).toLocaleDateString('en-GB')}
                  </td>
                  <td>{order.time_range}</td>
                  <td>{order.phone_number}</td>
                  <td>{order.payment_status}</td>
                  <td>{order.payment_sum}</td>
                  <td>{order.weather_status}</td>
                  <td>{order.court_type}</td>
                  <td>{order.game_type}</td>
                  <td>{order.request_players}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className='orderp'>Please choose a date of game and a court type</p>
        <div className='calendar'>
          <Calendar
            onChange={setDate}
            value={date}
            onClickDay={handleDayClick}
          />
        </div>
        <div className='time-position'>
          <Times
            showTime={showTime}
            courtType={courtType}
            isDisabled={courtType === ''}
            date={date}
            availableSlot={availableSlot}
            onTimeSelect={handleTimeSelect}
          />
        </div>

        <div className='paypal'>
          <PayPalScriptProvider
            options={{
              'client-id':
                'AW4xSa153VqcBGo7FDFB9SftHMecs8gUxn39_NoRLAeUPL1eRDF5LyS_i_W836sWxd1Q5TXyGPXtJavr',
            }}
          >
            <p>Make a payment using PayPal:</p>
            {checkout && (
              <PayPal
                courtType={courtType}
                paymentSum={payment_sum}
                setCheckOut={setCheckOut}
                setCompletedPayPalPayment={setCompletedPayPalPayment} // Pass the state setter
                date_of_game={dateOfGame}
                time_range={`${timeRange[0] || ''} - ${timeRange[1] || ''}`}
                onPaymentSuccess={(status) => {
                  if (status) {
                    setpayment_status('paid'); // Set payment_status to "payed" if payment is successful
                  } else {
                    setpayment_status('Notpaid'); // Set payment_status to "Notpayed" if payment is not completed
                  }
                }}
                payment_status={payment_status}
              />
            )}
            {!checkout && (
              <button
                className='paypal-btn'
                onClick={() => {
                  setCheckOut(true);
                }}
              >
                pay via paypal
              </button>
            )}
          </PayPalScriptProvider>
        </div>

        <form className='myform'>
          <div>
            <label>
              Date of game:
              <input
                value={dateOfGame}
                onChange={(event) => {
                  setDateOfGame(event.target.value);
                }}
              />
            </label>
          </div>
          <div>
            <label>
              Time range:
              <input
                id='time_range_input'
                value={`${timeRange[0] || ''} - ${timeRange[1] || ''}`}
                readOnly
              />
            </label>
          </div>
        </form>
        <form className='myform2'>
          <div>
            <label>
              Court type:
              <select value={courtType} onChange={handleCourtTypeSelect}>
                <option value=''>Select Court Type</option>
                <option value='half_court'>Half court</option>
                <option value='full_court'>Full court</option>
              </select>
            </label>
          </div>
          <p className='p1'></p>
          <div>
            <label>
              Game type:
              <select
                value={game_type}
                onChange={(event) => {
                  setgame_type(event.target.value);
                }}
              >
                <option value=''>Select Game Type</option>
                <option value='Football'>Football</option>
                <option value='Basketball'>Basketball</option>
              </select>
            </label>
          </div>
          <div className='court-price'>
            {courtType === 'half_court' && <p>Price: $30</p>}
            {courtType === 'full_court' && <p>Price: $60</p>}
            <button
              className='sub-btn'
              type='submit'
              onClick={handleOrderSubmit}
            >
              Submit Order
            </button>
            {errorMessage && <p className='error-message'>{errorMessage}</p>}
          </div>
        </form>
      </div>
    </div>
  );
  //#endregion

  //#region :Fetch data for a specific date
  async function fetchDateData(date) {
    const response = await fetch(
      `http://localhost:5000/order/day?date=${date}`
    );
    const times = await response.json();
    setNonAvailableTimes(times);
    setCourtType('');
  }
  //#endregion

  //#region :Calculate available time slots
  function getAvailableSlots() {
    const times = {
      '08:00 - 10:00': 'full_court',
      '10:00 - 12:00': 'full_court',
      '12:00 - 14:00': 'full_court',
      '14:00 - 16:00': 'full_court',
      '16:00 - 18:00': 'full_court',
      '18:00 - 20:00': 'full_court',
      '20:00 - 22:00': 'full_court',
    };

    for (const takenSlot of nonAvailableTimes) {
      const currentSlot = takenSlot.time_range;
      if (
        times[currentSlot] === 'full_court' &&
        takenSlot.court_type === 'full_court'
      ) {
        // taken for full court
        delete times[currentSlot];
      } else if (
        times[currentSlot] === 'full_court' &&
        takenSlot.court_type === 'half_court'
      ) {
        // taken for half court
        times[currentSlot] = 'half_court';
      } else if (
        times[currentSlot] === 'half_court' &&
        takenSlot.court_type === 'half_court'
      ) {
        // taken for half court for 2 time
        delete times[currentSlot];
      }
    }

    console.log('times', times);
    setAvailableSlots(times);
    setTimeRange([]);
  }
  //#endregion
}

export default Order;
//#endregion
