//#region : Imported Modules
import { useState, useEffect } from 'react';
import './darkMode.modules.css';
//#endregion

//#region : Dark Mode Function
function DarkModeToggle() {
  //set UseState
  const [isDarkMode, setIsDarkMode] = useState(false);

  //#region :This useEffect hook sets the class of the <body> element based on the value of isDarkMode
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);
  //#endregion

  //#region :This function toggles the value of isDarkMode
  function toggleDarkMode() {
    setIsDarkMode((prevMode) => !prevMode);
  }
  //#endregion

  //#region : render component JSX
  return (
    <div className='dark-mode-toggle-container'>
      <div className='dark-mode-toggle'>
        <input
          type='checkbox'
          checked={isDarkMode}
          onChange={toggleDarkMode}
          id='dark-mode-toggle'
        />
        <label htmlFor='dark-mode-toggle'>
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </label>
      </div>
    </div>
  );
  //#endregion
}
//#endregion
export default DarkModeToggle;
