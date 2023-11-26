//#region : Imported Modules
import React, { useState, useEffect } from 'react';
import ContactStyles from './AdminContacts.module.css';
//#endregion

//#region : Function that takes cate of messages between users and admin
function AdminContacts() {
  // State for managing messages and replies
  const [messages, setMessages] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});
  const [email] = useState('');
  //#region :  // Fetch messages when the page loads
  useEffect(() => {
    fetch('http://localhost:5000/adminContacts/contacts')
      .then((res) => res.json())
      .then((data) => {
        // Add a reply status to each message if it doesn't exist in localStorage
        const messagesWithStatus = data.map((message) => ({
          ...message,
          replyStatus:
            localStorage.getItem(`replyStatus_${message.id}`) || 'Not Replied',
        }));
        setMessages(messagesWithStatus);
      })
      .catch((err) => console.error(err));
  }, []);
  //#endregion

  //#region : handle reply to the user message
  const handleReply = (messageId) => {
    const reply = replyTexts[messageId];

    if (!reply) {
      alert('Reply text is empty. Please enter a reply.');
      return;
    }
    fetch('http://localhost:5000/adminContacts/reply', {
      method: 'POST',
      body: JSON.stringify({ id: messageId, reply, email }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(() => {
        // Clear the reply text input
        setReplyTexts((prevReplyTexts) => ({
          ...prevReplyTexts,
          [messageId]: '',
        }));
        // Update the reply status in the messages state
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.id === messageId
              ? { ...message, replyStatus: 'Replied' }
              : message
          )
        );

        // Save the reply status in localStorage
        localStorage.setItem(`replyStatus_${messageId}`, 'Replied');
      })

      .catch((err) => {
        console.error(err);
      });
  };
  //#endregion

  //#region : set the reply text
  const handleReplyTextChange = (messageId, text) => {
    setReplyTexts((prevReplyTexts) => ({
      ...prevReplyTexts,
      [messageId]: text,
    }));
  };
  //#endregion

  //#region : Function to delete a contact message
  function DeleteContact(id) {
    fetch('http://localhost:5000/adminContacts/deleteContact', {
      method: 'POST',
      body: JSON.stringify({ id: id }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Handle the response as needed
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message.id !== id)
        );
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
        alert('Error deleting order');
      });
  }
  //#endregion

  //#region : Render the component
  return (
    <div>
      <h1 className={ContactStyles.h1}>Admin Contacts</h1>
      {/* This div contains the main content for the admin contacts page */}
      <div className={ContactStyles.concontact_us_body}>
        <div className={ContactStyles.contable_container}>
          <div className={ContactStyles.conscroller}>
            <table>
              <thead>
                <tr>
                  {/* Table headers */}
                  <th>UserName</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Reply Status</th>
                  <th>Reply</th>
                  <th>Delete Message</th>
                </tr>
              </thead>

              <tbody>
                {/* Map through the 'messages' array and create a row for each message */}
                {messages.map((message) => (
                  <tr key={message.id}>
                    <td>{message.user_name}</td>
                    <td>{message.subject}</td>
                    <td>{message.message}</td>
                    <td
                      className={
                        message.replyStatus === 'Not Replied'
                          ? ContactStyles.not_replied
                          : ContactStyles.replied
                      }
                    >
                      {message.replyStatus}
                    </td>
                    <td>
                      {/* Textarea for replying to the message */}
                      <textarea
                        placeholder='Reply...'
                        value={replyTexts[message.id] || ''}
                        onChange={(e) =>
                          handleReplyTextChange(message.id, e.target.value)
                        }
                      />
                      {/* Button to send a reply */}
                      <button
                        className={ContactStyles.consend_reply_button}
                        onClick={() => handleReply(message.id)}
                      >
                        Send Reply
                      </button>
                    </td>
                    <td>
                      {/* Button to delete the message */}
                      <button
                        className={ContactStyles.condeleteContactBtn}
                        onClick={() => DeleteContact(message.id)}
                      >
                        Delete order
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
export default AdminContacts;
