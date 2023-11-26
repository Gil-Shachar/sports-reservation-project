//#region : Imported Modules
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { valiSignUpInput } from './SignUpValidation';
import styles from './signup.module.css';
//#endregion

//#region : SignUp Function
function SignUp() {
  //#region : Define state variables
  const [name, setName] = useState('');
  const [last_name, setLast_name] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [email, setEmail] = useState('');
  const [user_type] = useState('user');
  const [date_of_birth, setDate_of_birth] = useState('');
  const [user_name, setUser_name] = useState('');
  const [password, setpassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [message, setmessage] = useState('');
  const navigate = useNavigate();
  //#endregion

  //#region : Define a function to handle form submission
  const handleSubmit = async (event) => {
    const validationErrors = valiSignUpInput({
      name,
      last_name,
      phone_number,
      email,
      date_of_birth,
      user_name,
      password,
      confirmpassword,
    });

    // Check for empty fields
    const emptyFields = Object.entries({
      name,
      last_name,
      phone_number,
      email,
      date_of_birth,
      user_name,
      password,
      confirmpassword,
    })
      .filter(([_, value]) => value === '')
      .map(([field]) => field);

    if (emptyFields.length > 0) {
      setmessage('error sign up, fields are empty!');
      return;
    }

    if (validationErrors.length > 0) {
      setmessage('error sign up, ivalid input!!');
      return;
    }
    event.preventDefault();

    try {
      // Check if the username and phone number already exist
      const response = await fetch('http://localhost:5000/signup/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: user_name,
          phone_number: phone_number,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.existsUserName) {
          setmessage('Username already exists');
          return;
        }
        if (data.existsPhoneNumber) {
          setmessage('Phone number already exists');
          return;
        }
      } else {
        console.log('Error checking username and phone number');
      }
    } catch (error) {
      console.log(error);
    }
    // Submit the form data to the server
    fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        last_name: last_name,
        phone_number: phone_number,
        email: email,
        user_type: user_type,
        date_of_birth: date_of_birth,
        user_name: user_name,
        password: password,
        confirmpassword: confirmpassword,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res.message);
        if (res.message === 'password and confirmation do not match') {
          alert('Password and confirmation do not match');
        } else if (res.message === 'all good') {
          navigate('/');
        }
      })

      .catch((err) => {
        console.log(err);
      });
  };
  //#endregion

  //#region :Render the component JSX
  return (
    <div className={styles.signupbody}>
      <div className={styles.signupmain}>
        <div className={styles.signupshadowBox}>
          <h1>Sign Up</h1>
          {/* sign up form */}
          <form className={styles.signupform}>
            <div className={styles.signupuser}>
              <input
                // name input
                className={styles.logininput}
                type='text'
                placeholder='Name'
                name='name'
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </div>
            <div className={styles.signupuser}>
              <input
                // last name input
                className={styles.logininput}
                type='text'
                placeholder='Last Name'
                name='last_name'
                value={last_name}
                onChange={(event) => {
                  setLast_name(event.target.value);
                }}
              />
            </div>

            <div className={styles.signupuser}>
              <input
                // phone number input
                className={styles.logininput}
                type='text'
                placeholder='Phone Number'
                name='phone_number'
                value={phone_number}
                onChange={(event) => {
                  setPhone_number(event.target.value);
                }}
              />
            </div>
            <div className={styles.signupuser}>
              <input
                //email input
                className={styles.logininput}
                type='email'
                placeholder='Email'
                name='email'
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
            </div>
            <div className={styles.signupuser}>
              <input
                //date of birth input
                className={styles.logininput}
                type='date'
                placeholder='Date Of Birth'
                name='date_of_birth'
                value={date_of_birth}
                onChange={(event) => {
                  setDate_of_birth(event.target.value);
                }}
              />
            </div>
            <div className={styles.signupuser}>
              <input
                //username input
                className={styles.logininput}
                type='text'
                placeholder='UserName'
                name='username'
                value={user_name}
                onChange={(event) => {
                  setUser_name(event.target.value);
                }}
              />
            </div>
            <div className={styles.signupuser}>
              <input
                //password input
                className={styles.logininput}
                type='password'
                placeholder='Password'
                name='password'
                value={password}
                onChange={(event) => {
                  setpassword(event.target.value);
                }}
              />
            </div>
            <div className={styles.signupuser}>
              <input
                //password confirmation input
                className={styles.logininput}
                type='password'
                placeholder='Comfirmation Password'
                name='confirmationpassword'
                value={confirmpassword}
                onChange={(event) => {
                  setConfirmpassword(event.target.value);
                }}
              />
            </div>
            {/* sign up button */}
            <button
              className={styles.signupbtn}
              type='submit'
              onClick={handleSubmit}
              style={{ 'margin-left': '2rem' }}
            >
              Sign Up
            </button>
          </form>
        </div>
        <p className={styles.signuperrMessage}>{message}</p>
        <p className={styles.signuplink}>
          already have an account? go back to{' '}
          <Link to='/' style={{ color: 'blue' }}>
            Login Page
          </Link>
        </p>
      </div>
    </div>
  );
  //#endregion
}
//#endregion
export default SignUp;
