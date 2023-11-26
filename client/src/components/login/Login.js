// /* eslint-disable jsx-a11y/anchor-is-valid */
// //#region : Imported Modules
// import * as React from 'react';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import styles from './login.module.css';
// //#endregion

// //#region : Login Function
// function Login() {
//   // Initialize state variables using the useState hook
//   const [user_name, setUser_name] = useState('');
//   const [password, setPassword] = useState('');
//   const [errormessage, seterrormessage] = useState('');
//   const navigate = useNavigate();

//   //#region : Define a function to handle the login submission
//   const handleSubmit1 = async (event) => {
//     event.preventDefault();
//     // Check if username and password are provided
//     if (!user_name || !password) {
//       seterrormessage('Please fill out all fields.');
//       return;
//     }

//     try {
//       // Send a POST request to the login endpoint
//       const response = await fetch('http://localhost:5000/login', {
//         user_name: user_name,
//         password: password,
//         method: 'POST',
//         body: JSON.stringify({ user_name, password }),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       const data = await response.json();
//       console.log(data[0]);

//       // if (response.status === 200) {
//       if (data.length > 0) {
//         console.log(data[0]);
//         if (data[0].user_type === 'user') {
//           if (data[0].is_blocked === 'Not Blocked') {
//             // Store user information in sessionStorage
//             sessionStorage.setItem('phone', data[0].phone_number);
//             sessionStorage.setItem('name', data[0].name);
//             sessionStorage.setItem('familyName', data[0].last_name);
//             sessionStorage.setItem('email', data[0].email);
//             sessionStorage.setItem('date_of_birth', data[0].date_of_birth);
//             sessionStorage.setItem('user_name', data[0].user_name);
//             // Navigate to the 'order' page for users
//             navigate('/order');
//           } else {
//             seterrormessage('username blocked');
//           }
//         } else {
//           // Navigate to the 'adminDashboard' page for admins
//           navigate('/adminDashboard');
//         }
//       } else {
//         seterrormessage('Wrong username or password');
//       }
//     } catch (err) {
//       console.error(err);
//       console.log('Error logging in');
//     }
//   };
//   //#endregion

//   //#region :Define a function to handle password reset
//   const handlePasswordReset = async (event) => {
//     event.preventDefault();
//     try {
//       // Send a POST request to the password reset endpoint
//       const response = await fetch(
//         'http://localhost:5000/auth/password-reset',
//         {
//           method: 'POST',
//           body: JSON.stringify({ user_name }),
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       const data = await response.json();
//       console.log(data);
//       // Check the response status and show appropriate message
//       if (response.status === 200) {
//         seterrormessage('Password reset email sent');
//       } else {
//         seterrormessage('Wrong username');
//       }
//     } catch (err) {
//       console.error(err);
//       console.log('Error resetting password');
//     }
//   };
//   //#endregion

//   //#region :Render the login form and components
//   return (
//     <div className={styles.loginbackgroundImage}>
//       <div className={styles.loginContainer}>
//         <div className={styles.loginform}>
//           <h1>Log In</h1>
//           <div className={styles.logininput}>
//             <label>
//               Username
//               <input
//                 className={styles.logininput}
//                 type='text'
//                 value={user_name}
//                 onChange={(e) => setUser_name(e.target.value)}
//               />
//             </label>
//             <p className='login_p'></p>
//             <label>
//               Password
//               <input
//                 className={styles.logininput}
//                 type='password'
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </label>
//           </div>
//           {/* Log In Button */}
//           <button
//             className={styles.loginbutton}
//             type='submit'
//             onClick={(event) => {
//               handleSubmit1(event);
//             }}
//           >
//             Log In
//           </button>
//           {/* Display error message if any */}
//           {errormessage && (
//             <p className={styles.lierrmessage}>{errormessage}</p>
//           )}
//           <p className={styles.login_p}></p>
//           <p className={styles.loginp}>
//             Don't have an account?{' '}
//             <Link className={styles.loginlink} to='/signup'>
//               Sign up here
//             </Link>
//             .
//           </p>
//           <p className={styles.login_p}></p>

//           <p className={styles.loginp}>
//             {' '}
//             Forgot password?{' '}
//             <a
//               href='#'
//               className={styles.loginlink}
//               onClick={handlePasswordReset}
//             >
//               Reset Password{' '}
//             </a>
//           </p>
//           {/* Contact Us Link */}
//           <p className={styles.login_p}></p>
//           <p className={styles.loginp}>
//             Need assistance? Contact us at{' '}
//             <a
//               href='mailto:sportgames540@gmail.com'
//               className={styles.loginlink}
//             >
//               sportgames540@gmail.com
//             </a>
//             .
//           </p>
//         </div>
//       </div>
//     </div>
//   );
//   //#endregion
// }
// //#endregion
// export default Login;
/* eslint-disable jsx-a11y/anchor-is-valid */
//#region : Imported Modules
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './login.module.css';
//#endregion

//#region : Login Function
function Login() {
  // Initialize state variables using the useState hook
  const [user_name, setUser_name] = useState('');
  const [password, setPassword] = useState('');
  const [errormessage, seterrormessage] = useState('');
  const navigate = useNavigate();

  //#region : Define a function to handle the login submission
  const handleSubmit1 = async (event) => {
    event.preventDefault();
    // Check if username and password are provided
    if (!user_name || !password) {
      seterrormessage('Please fill out all fields.');
      return;
    }

    try {
      // Send a POST request to the login endpoint
      const response = await fetch('http://localhost:5000/login', {
        user_name: user_name,
        password: password,
        method: 'POST',
        body: JSON.stringify({ user_name, password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data[0]);

      // if (response.status === 200) {
      if (data.length > 0) {
        console.log(data[0]);
        if (data[0].user_type === 'user') {
          if (data[0].is_blocked === 'Not Blocked') {
            // Store user information in sessionStorage
            sessionStorage.setItem('phone', data[0].phone_number);
            sessionStorage.setItem('name', data[0].name);
            sessionStorage.setItem('familyName', data[0].last_name);
            sessionStorage.setItem('email', data[0].email);
            sessionStorage.setItem('date_of_birth', data[0].date_of_birth);
            sessionStorage.setItem('user_name', data[0].user_name);
            // Navigate to the 'order' page for users
            navigate('/order');
          } else {
            seterrormessage('username blocked');
          }
        } else {
          // Navigate to the 'adminDashboard' page for admins
          navigate('/adminDashboard');
        }
      } else {
        seterrormessage('Wrong username or password');
      }
    } catch (err) {
      console.error(err);
      console.log('Error logging in');
    }
  };
  //#endregion

  //#region :Define a function to handle password reset
  const handlePasswordReset = async (event) => {
    event.preventDefault();
    try {
      // Send a POST request to the password reset endpoint
      const response = await fetch(
        'http://localhost:5000/auth/password-reset',
        {
          method: 'POST',
          body: JSON.stringify({ user_name }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      console.log(data);
      // Check the response status and show appropriate message
      if (response.status === 200) {
        seterrormessage('Password reset email sent');
      } else {
        seterrormessage('Wrong username');
      }
    } catch (err) {
      console.error(err);
      console.log('Error resetting password');
    }
  };
  //#endregion

  //#region :Render the login form and components
  return (
    <div className={styles.loginbackgroundImage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginform}>
          <h1>Log In</h1>
          <div className={styles.logininput}>
            <label>
              Username
              <input
                className={styles.logininput}
                type='text'
                value={user_name}
                onChange={(e) => setUser_name(e.target.value)}
              />
            </label>
            <p className='login_p'></p>
            <label>
              Password
              <input
                className={styles.logininput}
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          {/* Log In Button */}
          <button
            className={styles.loginbutton}
            type='submit'
            onClick={(event) => {
              handleSubmit1(event);
            }}
          >
            Log In
          </button>
          {/* Display error message if any */}
          {errormessage && (
            <p className={styles.lierrmessage}>{errormessage}</p>
          )}
          <p className={styles.login_p}></p>
          <p className={styles.loginp}>
            Don't have an account?{' '}
            <Link className={styles.loginlink} to='/signup'>
              Sign up here
            </Link>
            .
          </p>
          <p className={styles.login_p}></p>

          <p className={styles.loginp}>
            {' '}
            Forgot password?{' '}
            <a
              href='#'
              className={styles.loginlink}
              onClick={handlePasswordReset}
            >
              Reset Password{' '}
            </a>
          </p>
          {/* Contact Us Link */}
          <p className={styles.login_p}></p>
          <p className={styles.loginp}>
            Need assistance? Contact us at{' '}
            <a
              href='mailto:sportgames540@gmail.com'
              className={styles.loginlink}
            >
              sportgames540@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
  //#endregion
}
//#endregion
export default Login;
