//#region : Imported Modules
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './AdminNavBar.module.css';
//#endregion

//#region : Admin Navigation Bar
function AdminNavBar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/');
  };
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link to='/adminDashboard'>Dashboard</Link>
        </li>
        <li>
          <Link to='/adminContacts'>User Contacts</Link>
        </li>
        <li>
          <Link to='/adminReports'>Reports</Link>
        </li>
        <li>
          <Link to='/adminBlackList'>Black List</Link>
        </li>
        <li>
          <Link to='/' onClick={handleLogout}>
            Logout{''}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
//#endregion
export default AdminNavBar;
