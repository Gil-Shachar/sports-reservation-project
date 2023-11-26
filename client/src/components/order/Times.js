//#region : Imported Modules
import React, { useState } from 'react';
import styles from './Times.module.css';
//#endregion

//#region : time- range
const time = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
  '20:00 - 22:00',
];
//#endregion

//#region : handle the time props
function Times(props) {
  const { availableSlot, courtType, isDisabled } = props;

  const [selectedTime, setSelectedTime] = useState('');

  const handleTimeSelection = (selectedTime) => {
    const selectedRange = selectedTime.split(' - '); // Split the selected time range
    setSelectedTime(selectedRange[0]); // Set the selected range
    props.onTimeSelect(selectedRange); // Notify the parent component
  };

  const filteredTimes = time.filter(
    (time) =>
      availableSlot[time] &&
      (availableSlot[time] === courtType ||
        availableSlot[time] === 'full_court')
  );

  if (isDisabled) {
    return <div className='times'></div>;
  }

  return (
    <div className={styles.times}>
      {filteredTimes.map((times) => (
        <div key={times}>
          <button
            className={`btn ${selectedTime === times ? 'selected' : ''}`}
            onClick={() => handleTimeSelection(times)}
            disabled={props.isDisabled}
          >
            {times}
          </button>
        </div>
      ))}
      <div>{selectedTime && <p></p>}</div>
    </div>
  );
}

export default Times;
//#endregion
