//#region : Imported Modules
import React, { useState } from 'react';
import './myProfile.modules.css';
//#endregion

//#region : function that updates all the user stats also changing to new password
function MyProfile() {
  //#region :  Initialize state variables
  const [name, setName] = useState(sessionStorage.getItem('name'));
  const [last_name, setLast_name] = useState(
    sessionStorage.getItem('familyName')
  );
  const [phone_number] = useState(sessionStorage.getItem('phone'));
  const [email, setEmail] = useState(sessionStorage.getItem('email'));
  const [date_of_birth, setDate_of_birth] = useState(
    sessionStorage.getItem('date_of_birth')
  );
  const [user_name, setUser_name] = useState(
    sessionStorage.getItem('user_name')
  );
  const [confirmnewpassword, setConfirmnewpassword] = useState('');
  const [setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  //#endregion

  //#region :Function to handle profile update
  const handleUpdate = (event) => {
    event.preventDefault();
    fetch('http://localhost:5000/myProfile/updateMyProfile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        last_name: last_name,
        phone_number: phone_number,
        email: email,
        date_of_birth: date_of_birth,
        user_name: user_name,
      }),
    })
      .then((res) => {
        if (res.ok) {
          // Reset password fields after successful change
          setPassword('');
          setNewPassword('');
          console.log('Profile updated successfully');
          console.log(res);
        } else {
          console.log('Error updating the profile');
        }
      })
      .then((data) => {
        if (data.length > 0) {
          console.log(data);
        } else {
          console.log('error with data');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //#endregion

  //#region :  Function to handle password change
  const handleNewPassword = (event) => {
    event.preventDefault();
    if (!newPassword || !confirmnewpassword) {
      //check if fields are empty
      setErrorMessage('Please fill out all required fields.');
      return;
    }
    fetch('http://localhost:5000/myProfile/updatepassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newPassword: newPassword,
        confirmnewpassword: confirmnewpassword,
        phone_number: phone_number,
      }),
    })
      .then((res) => {
        if (res.ok && newPassword === confirmnewpassword) {
          setErrorMessage('changed password successfully!!');
          console.log(res);
        } else {
          setErrorMessage('failed to changed password !!');
        }
      })
      .catch((err) => {
        console.log('error changing password');
        console.log(err);
      });
  };
  //#endregion

  //#region : JSX for the component's return
  return (
    <div className='first'>
      <div>
        {/*  change stats form */}
        <form className='f1'>
          <h1 className='my_profile'>My Profile</h1>
          <div className='n1'>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              placeholder='Name'
              name='name'
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </div>
          <div className='lastname'>
            <label htmlFor='lastname'>Last Name</label>
            <input
              type='text'
              placeholder='Last Nmae'
              name='last_name'
              value={last_name}
              onChange={(event) => {
                setLast_name(event.target.value);
              }}
            />
          </div>

          <div className='phone'>
            <label htmlFor='phone'>Phone Number</label>
            <input
              type='text'
              placeholder='Phone Number'
              name='phone_number'
              value={phone_number}
              readOnly
            />
          </div>
          <div className='email'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              placeholder='Email'
              name='email'
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </div>
          <div className='date'>
            <label htmlFor='date'>Date Of Birth</label>
            <input
              type='text'
              placeholder='Date Of Birth'
              name='date_of_birth'
              value={date_of_birth}
              onChange={(event) => {
                setDate_of_birth(event.target.value);
              }}
            />
          </div>
          <div className='styles.username'>
            <label htmlFor='username'>UserName</label>
            <input
              type='text'
              placeholder='UserName'
              name='username'
              value={user_name}
              onChange={(event) => {
                setUser_name(event.target.value);
              }}
            />
          </div>
          <div>
            <button type='submit' onClick={handleUpdate} className='btn1'>
              Update Profile
            </button>
          </div>
        </form>
        {/* change password form */}
        <form className='updatepass'>
          <h1 className='newpass'>Change Password</h1>
          <div className='currenrpass'>
            <label htmlFor='lastname'>Enter New Password</label>
            <input
              type='password'
              placeholder='new password'
              name='newpassword'
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
              }}
            />
          </div>
          <div className='newpass1'>
            <label htmlFor='lastname'>Confirm New Password</label>
            <input
              type='password'
              placeholder='Confirm New Password'
              name='confirmnewpassword'
              value={confirmnewpassword}
              onChange={(event) => {
                setConfirmnewpassword(event.target.value);
              }}
            />
          </div>
          <button className='btn' type='submit' onClick={handleNewPassword}>
            update password
          </button>
          {errorMessage && <p className='error'>{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
  //#endregion
}
//#endregion

export default MyProfile;
