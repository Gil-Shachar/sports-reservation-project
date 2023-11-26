//#region : Imported Modules
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/login/Login';
import SignUp from './components/signup/Signup';
import Order from './components/order/Order';
import MyOrders from './components/myorders/MyOrders';
import JoinToOtherGame from './components/joinToOtherGame/JoinToOtherGame';
import ContactUs from './components/contactus/ContactUs';
import MyProfile from './components/myProfile/MyProfile';
import DarkModeToggle from './components/darkModeToggle/DarkModeToggle';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
import './components/darkModeToggle/darkMode.modules.css';
import NavBar from './components/navBar/NavBar';
import AdminNavBar from './components/adminNavBar/AdminNavBar';
import AdminReports from './components/adminReports/AdminReports';
import AdminContacts from './components/adminContacts/AdminContacts';
import AdminBlackList from './components/adminBlackList/AdminBlackList';
import './Style.module.css';
//#endregion

//#region : Main App Component
function App() {
  // Get the current route location
  const location = useLocation();
  // Determine whether to show the navigation bar based on the route
  const showNavBar =
    location.pathname !== '/signup' && location.pathname !== '/';
  // Determine whether the current route is in the admin section
  const isAdminPath = location.pathname.includes('/admin');
  return (
    <>
      {showNavBar && (isAdminPath ? <AdminNavBar /> : <NavBar />)}
      <div>
        {/* Dark Mode Toggle */}
        <DarkModeToggle />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/order' element={<Order />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='/joinToOtherGame' element={<JoinToOtherGame />} />
          <Route path='/contactus' element={<ContactUs />} />
          <Route path='/myProfile' element={<MyProfile />} />
          <Route path='/adminDashboard' element={<AdminDashboard />} />
          <Route path='/adminReports' element={<AdminReports />} />
          <Route path='/adminContacts' element={<AdminContacts />} />
          <Route path='/adminBlackList' element={<AdminBlackList />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
//#endregion
