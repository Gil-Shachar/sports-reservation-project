import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importing necessary dependencies
import styles from './navBar.module.css'; // Importing CSS styles for the component

function NavBar() {
  const navigate = useNavigate(); // Initializing the useNavigate hook for programmatic navigation

  // Function to handle user logout and navigate to the home page
  const handleLogout = () => {
    navigate('/'); // Redirect to the home page ('/') when the user logs out
  };

  return (
    <nav className={styles.nav}>
      {' '}
      {/* Apply CSS styles defined in the 'nav' class */}
      <ul>
        <li>
          <a href='/Order'>Order</a> {/* Navigation link to the 'Order' page */}
        </li>
        <li>
          <a href='/MyOrders'>My Orders</a>{' '}
          {/* Navigation link to the 'My Orders' page */}
        </li>
        <li>
          <a href='/JoinToOtherGame'>Join To Other Game</a>{' '}
          {/* Navigation link to the 'Join To Other Game' page */}
        </li>
        <li>
          <a href='/ContactUs'>Contact Us</a>{' '}
          {/* Navigation link to the 'Contact Us' page */}
        </li>
        <li>
          <a href='/MyProfile'>My Profile</a>{' '}
          {/* Navigation link to the 'My Profile' page */}
        </li>
        <li>
          <a href='/' onClick={handleLogout}>
            LogOut
          </a>{' '}
          {/* Logout link that triggers the handleLogout function */}
        </li>
      </ul>
    </nav>
  );
}

export default NavBar; // Exporting the NavBar component for use in other parts of the application
