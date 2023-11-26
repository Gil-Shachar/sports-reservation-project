// //#region : Imported Modules
// import React, { useEffect, useState } from 'react';
// import Calendar from 'react-calendar';
// import styles from './AdminDashboard.module.css';
// //#endregion

// //#region : Admin Dashboard Function
// function AdminDashboard() {
//   //#region : State variables for managing date and time data
//   const [date, setDate] = useState(new Date());
//   const [setDateOfGame] = useState('');
//   const [setShowTime] = useState(false);
//   const [dateTimes, setDateTimes] = useState([]);
//   const [bad_weather_begin, setBadWeatherBegin] = useState('');
//   const [bad_weather_end, setBadWeatherEnd] = useState('');
//   //#endregion

//   //#region : Fetch initial date data when the component mounts
//   useEffect(() => {
//     fetchDateData(new Date().toLocaleDateString('en-CA'));
//   }, []);
//   //#endregion

//   //#region : Function to fetch date data and update state
//   async function fetchDateData(date) {
//     const response = await fetch(
//       `http://localhost:5000/order/day?date=${date}`
//     );
//     const times = await response.json();
//     console.log('times', times);
//     setDateTimes(times);
//   }
//   //#endregion

//   //#region : Function to handle a day click event on the calendar
//   const handleDayClick = async (data) => {
//     const date = data.toLocaleDateString('en-CA');
//     setDateOfGame(date);
//     setShowTime(true);

//     await fetchDateData(date);

//     // Update the calendar's value to the clicked date
//     setDate(data);
//   };
//   //#endregion

//   //#region :  Function to handle weather status update
//   const handleWeatherUpdate = async (event) => {
//     event.preventDefault();
//     if (bad_weather_begin <= bad_weather_end) {
//       try {
//         const response = await fetch(
//           'http://localhost:5000/adminDashboard/weather',
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               bad_weather_begin: bad_weather_begin,
//               bad_weather_end: bad_weather_end,
//             }),
//           }
//         );

//         if (!response.ok) {
//           const errorMessage = await response.text();
//           throw new Error(errorMessage);
//         }

//         // Optionally, you can do something with the response
//         const result = await response.json();
//         console.log(result);
//         alert('Weather status updated succesfully!');
//       } catch (error) {
//         console.error('Error updating weather:', error.message);
//       }
//     } else {
//       alert('Begin of weather must be smaller than the bigger');
//     }
//   };
//   //#endregion

//   //#region : Render Component
//   return (
//     <div>
//       <h1>Reservations state</h1>
//       <div className={styles.dashmaincontainer}>
//         {/* Calendar component */}
//         <div className={styles.calendarContainer}>
//           <Calendar
//             className={styles.dashcalendar}
//             onChange={setDate}
//             value={date}
//             onClickDay={handleDayClick}
//             tileContent={({ date, view }) =>
//               view === 'month' &&
//               dateTimes.some(
//                 (d) =>
//                   d.date_of_game === date.toLocaleDateString('en-CA') &&
//                   d.isFullyReserved
//               ) ? (
//                 <div className={styles.fullyReservedMarker}></div> // Add a CSS class for styling
//               ) : null
//             }
//           />
//         </div>
//         {/* Time slots container */}
//         <div className={styles.timescontainer}>
//           {[
//             '08:00 - 10:00',
//             '10:00 - 12:00',
//             '12:00 - 14:00',
//             '14:00 - 16:00',
//             '16:00 - 18:00',
//             '18:00 - 20:00',
//             '20:00 - 22:00',
//           ].map((timeRange) => {
//             const [start, end] = timeRange.split(' - ');
//             const orders = dateTimes.filter((d) => d.time_range === timeRange);
//             const isHalfCourt = orders.some(
//               (order) => order.court_type === 'half_court'
//             );
//             const isFullCourt = orders.some(
//               (order) => order.court_type === 'full_court'
//             );

//             const nameClass =
//               isFullCourt || orders.length === 2
//                 ? styles.full
//                 : isHalfCourt
//                 ? styles.half
//                 : styles.available;
//             return (
//               <div>
//                 <div className={styles.courtRow}>
//                   <div>{start}</div>
//                   <div>{end}</div>
//                   {!isHalfCourt ? (
//                     <>
//                       <div className={nameClass}>
//                         {orders[0]?.name} {orders[0]?.last_name}{' '}
//                       </div>
//                       <div>{orders[0]?.payment_status}</div>
//                     </>
//                   ) : (
//                     <>
//                       <div className={nameClass}>
//                         <div className={styles.borderBottom}>
//                           {orders[0]?.name} {orders[0]?.last_name}{' '}
//                         </div>
//                         <div>
//                           {orders[1]
//                             ? `${orders[1]?.name} ${orders[1]?.last_name}`
//                             : 'Available'}
//                         </div>
//                       </div>
//                       <div>
//                         <div className={styles.borderBottom}>
//                           {orders[0]?.payment_status}
//                         </div>
//                         <div>{orders[1]?.payment_status || ' '}</div>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//       <div>
//         {/* Weather status input form */}
//         <div className={styles.dashinputs}>
//           <h1 className={styles.weatherHeading}>Set weather status</h1>
//           <label htmlFor='date'>Begin of bad weather</label>
//           <input
//             type='date'
//             placeholder='Bad weather starts'
//             name='bad_weather_begin'
//             value={bad_weather_begin}
//             onChange={(event) => {
//               setBadWeatherBegin(event.target.value);
//             }}
//           />
//           <label htmlFor='date'>Ends of bad weather</label>
//           <input
//             type='date'
//             placeholder='Bad weather ends'
//             name='bad_weather_end'
//             value={bad_weather_end}
//             onChange={(event) => {
//               setBadWeatherEnd(event.target.value);
//             }}
//           />
//           <button className={styles.dashbtn} onClick={handleWeatherUpdate}>
//             Set bad weather
//           </button>
//         </div>
//       </div>
//     </div>
//   );
//   //#endregion
// }
// //#endregion
// export default AdminDashboard;
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import styles from './AdminDashboard.module.css';

function AdminDashboard() {
  const [date, setDate] = useState(new Date());
  const [dateOfGame, setDateOfGame] = useState('');
  const [showTime, setShowTime] = useState(false);
  const [dateTimes, setDateTimes] = useState([]);
  const [bad_weather_begin, setBadWeatherBegin] = useState('');
  const [bad_weather_end, setBadWeatherEnd] = useState('');

  useEffect(() => {
    fetchDateData(new Date().toLocaleDateString('en-CA'));
  }, []);

  async function fetchDateData(date) {
    const response = await fetch(
      `http://localhost:5000/order/day?date=${date}`
    );
    const times = await response.json();
    console.log('times', times);
    setDateTimes(times);
  }

  const handleDayClick = async (data) => {
    const date = data.toLocaleDateString('en-CA');
    setDateOfGame(date);
    setShowTime(true);

    await fetchDateData(date);

    // Update the calendar's value to the clicked date
    setDate(data);
  };

  const handleWeatherUpdate = async (event) => {
    event.preventDefault();
    if (bad_weather_begin <= bad_weather_end) {
      try {
        const response = await fetch(
          'http://localhost:8000/adminDashboard/weather',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              bad_weather_begin: bad_weather_begin,
              bad_weather_end: bad_weather_end,
            }),
          }
        );

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }

        // Optionally, you can do something with the response
        const result = await response.json();
        console.log(result);
        alert('Weather status updated succesfully!');
      } catch (error) {
        console.error('Error updating weather:', error.message);
      }
    } else {
      alert('Begin of weather must be smaller than the bigger');
    }
  };

  return (
    <div>
      <h1 className={styles.h1}>Reservations state</h1>
      <div className={styles.dashmaincontainer}>
        <div className={styles.calendarContainer}>
          <Calendar
            className={styles.dashcalendar}
            onChange={setDate}
            value={date}
            onClickDay={handleDayClick}
            tileContent={({ date, view }) =>
              view === 'month' &&
              dateTimes.some(
                (d) =>
                  d.date_of_game === date.toLocaleDateString('en-CA') &&
                  d.isFullyReserved
              ) ? (
                <div className={styles.fullyReservedMarker}></div> // Add a CSS class for styling
              ) : null
            }
          />
        </div>
        <div className={styles.timescontainer}>
          {[
            '08:00 - 10:00',
            '10:00 - 12:00',
            '12:00 - 14:00',
            '14:00 - 16:00',
            '16:00 - 18:00',
            '18:00 - 20:00',
            '20:00 - 22:00',
          ].map((timeRange) => {
            const [start, end] = timeRange.split(' - ');
            const orders = dateTimes.filter((d) => d.time_range === timeRange);
            const isHalfCourt = orders.some(
              (order) => order.court_type === 'half_court'
            );
            const isFullCourt = orders.some(
              (order) => order.court_type === 'full_court'
            );

            const nameClass =
              isFullCourt || orders.length === 2
                ? styles.full
                : isHalfCourt
                ? styles.half
                : styles.available;
            return (
              <div>
                <div className={styles.courtRow}>
                  <div>{start}</div>
                  <div>{end}</div>
                  {!isHalfCourt ? (
                    <>
                      <div className={nameClass}>
                        {orders[0]?.name} {orders[0]?.last_name}{' '}
                      </div>
                      <div>{orders[0]?.payment_status}</div>
                    </>
                  ) : (
                    <>
                      <div className={nameClass}>
                        <div className={styles.borderBottom}>
                          {orders[0]?.name} {orders[0]?.last_name}{' '}
                        </div>
                        <div>
                          {orders[1]
                            ? `${orders[1]?.name} ${orders[1]?.last_name}`
                            : 'Available'}
                        </div>
                      </div>
                      <div>
                        <div className={styles.borderBottom}>
                          {orders[0]?.payment_status}
                        </div>
                        <div>{orders[1]?.payment_status || ' '}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <div className={styles.dashinputs}>
          <h1 className={styles.weatherHeading}>Set weather status</h1>
          <label className={styles.l1} htmlFor='date'>
            Begin of bad weather
          </label>
          <input
            type='date'
            placeholder='Bad weather starts'
            name='bad_weather_begin'
            value={bad_weather_begin}
            onChange={(event) => {
              setBadWeatherBegin(event.target.value);
            }}
          />
          <label className={styles.l2} htmlFor='date'>
            Ends of bad weather
          </label>
          <input
            type='date'
            placeholder='Bad weather ends'
            name='bad_weather_end'
            value={bad_weather_end}
            onChange={(event) => {
              setBadWeatherEnd(event.target.value);
            }}
          />
          <button className={styles.dashbtn} onClick={handleWeatherUpdate}>
            Set bad weather
          </button>
        </div>
      </div>
    </div>
  );
}
export default AdminDashboard;
