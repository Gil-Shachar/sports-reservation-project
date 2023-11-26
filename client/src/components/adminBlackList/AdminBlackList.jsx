//#region : Imported Modules
import React, { useState, useEffect } from 'react';
import BlackListstyles from './adminBlackList.module.css';
//#endregion

//#region : Function that set the Blocked and Unblocked users
export default function AdminBlackList() {
  const [blocked_users, setUsers] = useState([]);
  const [block_user, setBlockedUsers] = useState([]);
  // Fetch users and blocked users when the component mounts
  useEffect(() => {
    fetchUsers();
    fetchBlockedUsers();
  }, []);
  //#region : Fetch users who are not blocked from the server
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/adminBlackList', {
        method: 'POST',
        body: JSON.stringify({ is_blocked: 'Not Blocked' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const uniqueUsers = [];
        const phoneNumbersSet = new Set();
        // Remove duplicates based on phone numbers
        data.forEach((user) => {
          if (!phoneNumbersSet.has(user.phone_number)) {
            uniqueUsers.push(user);
            phoneNumbersSet.add(user.phone_number);
          }
        });

        setUsers(uniqueUsers); // Update the state with sorted data
      } else {
        console.log('Error fetching users data');
      }
    } catch (error) {
      console.log(error);
    }
  };
  //#endregion

  //#region : Handle unblocking a user
  const handleUnblock = async (phone_number) => {
    try {
      // Send a request to unblock the user
      const response = await fetch(
        'http://localhost:5000/adminBlackList/unblock',
        {
          method: 'POST',
          body: JSON.stringify({
            phone_number: phone_number,
            is_blocked: 'Not Blocked', // Update to 'Yes' since we're unblocking
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        console.log('User has been unblocked successfully.');
        // Update the is_blocked status in the blocked_users state using phone_number
        const updatedUnblockedUsers = blocked_users.map((user) =>
          user.phone_number === phone_number
            ? { ...user, is_blocked: 'Not Blocked' }
            : user
        );
        setUsers(updatedUnblockedUsers); // Update the state here
        // Remove the user from block_user state
        const updatedBlockUsers = block_user.filter(
          (user) => user.phone_number !== phone_number
        );
        setBlockedUsers(updatedBlockUsers);
      } else {
        console.log('Error unblocking user.');
      }
    } catch (error) {
      console.error(error);
      console.log('An error occurred while unblocking the user.');
    }
  };
  //#endregion

  //#region : Handle blocking a user
  const handleBlock = async (phone_number) => {
    try {
      // Send a request to block the user
      const response = await fetch(
        'http://localhost:5000/adminBlackList/block',
        {
          method: 'POST',
          body: JSON.stringify({
            phone_number: phone_number,
            is_blocked: 'Not Blocked', // Update to 'Yes' since we're unblocking
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        console.log('User has been blocked successfully.');
        // Update the is_blocked status in the blocked_users state using phone_number
        const updatedBlockedUsers = blocked_users.map((user) =>
          user.phone_number === phone_number
            ? { ...user, is_blocked: 'Blocked' }
            : user
        );
        setUsers(updatedBlockedUsers); // Update the state here
        // Find the user from blocked_users and add them to block_user state
        const updatedUnBlockUsers = block_user.filter(
          (user) => user.phone_number !== phone_number
        );
        setBlockedUsers(updatedUnBlockUsers);
      } else {
        console.log('Error blocking user.');
      }
    } catch (error) {
      console.error(error);
      console.log('An error occurred while blocking the user.');
    }
  };
  // Sort users based on date_of_game and time_range
  const sortedUsers = blocked_users.slice().sort((a, b) => {
    const aDatetime = new Date(`${a.date_of_game} ${a.time_range}`);
    const bDatetime = new Date(`${b.date_of_game} ${b.time_range}`);
    return aDatetime - bDatetime;
  });
  // Separate users into notBlockedUsers and blockedUsers arrays
  const notBlockedUsers = sortedUsers.filter(
    (user) => user.is_blocked === 'Not Blocked'
  );
  const blockedUsers = sortedUsers.filter(
    (user) => user.is_blocked === 'Blocked'
  );
  //#endregion

  //#region : Fetch blocked users when the component mounts
  const fetchBlockedUsers = async () => {
    try {
      // Fetch blocked users from the server
      const response = await fetch(
        'http://localhost:5000/adminBlackList/getblocktable',
        {
          method: 'POST',
          body: JSON.stringify({ is_blocked: 'Blocked' }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBlockedUsers(data); // Store blocked users in state
      } else {
        console.log('Error fetching blocked users data');
      }
    } catch (error) {
      console.log(error);
    }
  };
  //#endregion

  //#region :  Render the component with tables of notBlockedUsers and blockedUsers
  return (
    <div>
      <div className={BlackListstyles.blmaincontainer}>
        {/* Header */}
        <h1 className={BlackListstyles.BLh1}>Black List</h1>
        <p className={BlackListstyles.BLp1}>
          In here, you have two Black List Tables, the first one contains the
          users who are Not Blocked, and the second one contains the users who
          are Blocked
        </p>
        {/* Users Orders Table */}
        <h2 className={BlackListstyles.blh2}>Users Orders</h2>
        <p className={BlackListstyles.blp2}>
          here you can see the table that contains the closest order for each
          user
        </p>
        <div className={BlackListstyles.bltablecontainer1}>
          <div className={BlackListstyles.blB_scroller1}>
            <table className={BlackListstyles.blordertable}>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Order Id</th>
                  <th>Phone Number</th>
                  <th>Date Of Game</th>
                  <th>Game Time Range</th>
                  <th>Weather Status</th>
                  <th>User Status</th>
                  <th>Block User</th>
                </tr>
              </thead>
              <tbody>
                {/* Mapping over notBlockedUsers to display user data */}
                {notBlockedUsers.map((user) => (
                  <tr key={user.phone_number}>
                    <td>{user.user_name}</td>
                    <td>{user.id}</td>
                    <td>{user.phone_number}</td>
                    <td>
                      {new Date(user.date_of_game).toLocaleDateString('en-GB')}
                    </td>
                    <td>{user.time_range}</td>
                    <td>{user.weather_status}</td>
                    <td
                      style={{
                        color: user.is_blocked === 'Blocked' ? 'red' : 'green',
                      }}
                    >
                      {user.is_blocked}
                    </td>
                    <td>
                      <button
                        className={BlackListstyles.blblockbutton}
                        onClick={() => handleBlock(user.phone_number)}
                      >
                        Block
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Mapping over blockedUsers to display user data */}
                {blockedUsers.map((user) => (
                  <tr key={user.phone_number}>
                    <td>{user.user_name}</td>
                    <td>{user.id}</td>
                    <td>{user.phone_number}</td>
                    <td>
                      {new Date(user.date_of_game).toLocaleDateString('en-GB')}
                    </td>
                    <td>{user.time_range}</td>
                    <td>{user.weather_status}</td>
                    <td
                      style={{
                        color: user.is_blocked === 'Blocked' ? 'red' : 'green',
                      }}
                    >
                      {user.is_blocked}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Blocked Users Table */}
        <h2 className={BlackListstyles.blh2}>Blocked Users</h2>
        <p className={BlackListstyles.blp2}>
          here you can see the table that contains all the users who have been
          blocked, unblock them by clicking the button unblock
        </p>
        <div className={BlackListstyles.bltablecontainer2}>
          <div className={BlackListstyles.blscroller2}>
            <table className={BlackListstyles.blordertable}>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Phone Number</th>
                  <th>User Status</th>
                  <th>Unblock User</th>
                </tr>
              </thead>
              <tbody>
                {/* Mapping over block_user to display blocked user data */}
                {block_user.map((user) => (
                  <tr key={user.phone_number}>
                    <td>{user.user_name}</td>
                    <td>{user.phone_number}</td>
                    <td
                      style={{
                        color: user.is_blocked === 'Blocked' ? 'red' : 'green',
                      }}
                    >
                      {user.is_blocked}
                    </td>
                    <td>
                      <button
                        className={BlackListstyles.blunblockbutton}
                        onClick={() => handleUnblock(user.phone_number)}
                      >
                        Unblock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
  //#endregion
}
//#endregion
