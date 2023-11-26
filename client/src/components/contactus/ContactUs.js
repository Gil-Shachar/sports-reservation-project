//#region : Imported Modules
import React, { useState, useEffect } from 'react';
import styles from './ContactUs.module.css';
//#endregion

//#region : Function that takes care of sending message from user side to admin side
function ContactUs() {
  //#region : State variables to manage form inputs and messages
  const [user_name, setUser_name] = useState(
    sessionStorage.getItem('user_name')
  );
  const [email, setEmail] = useState(sessionStorage.getItem('email'));
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  //#endregion

  //#region : Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Sending a POST request to the server with form data
    fetch('http://localhost:5000/contact', {
      method: 'POST',
      body: JSON.stringify({ user_name, email, subject, message }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(() => {
        // Clearing form inputs after successful submission
        setUser_name('');
        setEmail('');
        setSubject('');
        setMessage('');
        console.log('Message sent successfully');
      })
      .catch((err) => {
        console.error(err);
      });
  };
  //#endregion

  //#region : Fetching user's messages on component mount
  useEffect(() => {
    getMyMessages();
  }, []);
  //#endregion

  //#region :  Function to fetch user's messages from the server
  async function getMyMessages() {
    fetch('http://localhost:5000/contact/getMessages', {
      method: 'POST',
      body: JSON.stringify({ user_name: user_name }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.length > 0) {
          // Get the deleted message IDs from local storage
          const deletedMessageIds =
            JSON.parse(localStorage.getItem('deletedMessageIds')) || [];

          // Filter out messages with deleted IDs
          const filteredMessages = data.filter(
            (message) => !deletedMessageIds.includes(message.id)
          );
          setMessages(filteredMessages);
        } else {
          console.log('error getting data');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  //#endregion

  //#region : Function to handle message deletion
  const handleDeleteRow = (messageId) => {
    const updatedMessages = messages.filter(
      (message) => message.id !== messageId
    );
    setMessages(updatedMessages);
    // Store the deleted message ID in local storage
    const deletedMessageIds =
      JSON.parse(localStorage.getItem('deletedMessageIds')) || [];
    localStorage.setItem(
      'deletedMessageIds',
      JSON.stringify([...deletedMessageIds, messageId])
    );
  };
  //#region

  //#region : render component JSX
  return (
    <div>
      {/* Main Heading */}
      <h1 className={styles.mainheading}>Contact Us</h1>
      {/* Main Paragraph */}
      <p className={styles.mainparagraph}>
        Have a question or feedback? Feel free to reach out to us using the form
        below. We're here to help!
      </p>
      {/* Message Submission Form */}
      <form onSubmit={handleSubmit} className={styles.contactform}>
        <div>
          <label htmlFor='subject'>Subject:</label>
          <input
            type='text'
            id='subject'
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        {/* Message Textarea */}
        <div>
          <label htmlFor='message'>Message:</label>
          <textarea
            type='textbox'
            id='message'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        {/* Submit Button */}
        <button type='submit'>Submit</button>
      </form>
      {/* Table of User Messages */}
      <div className={styles.tablediv}>
        {/* Table Heading */}
        <h2 className={styles.tableheading}>Your Contact Messages</h2>
        {/* Table Paragraph */}
        <p className={styles.tableparagraph}>
          Here you can view the messages you've sent to us and any responses
          from our team.
        </p>
        {/* User Messages Table */}
        <table className={styles.contactustable}>
          <thead>
            <tr className={styles.tr}>
              <th>Subject</th>
              <th>Message</th>
              <th>Admin Reply</th>
              <th>Delete Reply</th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {messages.map((message) => (
              <tr key={message.id}>
                {/* Subject Column */}
                <td>{message.subject}</td>
                {/* Message Column */}
                <td>{message.message}</td>
                {/* Admin Reply Column */}
                <td>{message.reply}</td>

                <td>
                  {/* Delete Row Button */}
                  <button
                    className={styles.deletebutton}
                    onClick={() => handleDeleteRow(message.id)}
                  >
                    Delete Row
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  //#endregion
}
//#endregion
export default ContactUs;
