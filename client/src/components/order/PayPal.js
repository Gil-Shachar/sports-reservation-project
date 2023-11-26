//#region : Imported Modules
import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
//#endregion
/**
 * PayPal Component
 *
 * This component renders PayPal payment buttons and handles payment processing.
 *
 * @param {number} paymentSum - The total payment amount.
 * @param {function} setCheckOut - A function to control the checkout process.
 * @returns {JSX.Element} - Returns a JSX element with PayPal payment buttons.
 */
//#region
function PayPal({
  paymentSum,
  setCheckOut,
  setCompletedPayPalPayment,
  date_of_game,
  time_range,
  onPaymentSuccess,
}) {
  // Insert the Client-ID of the PayPal business account into paypalOptions
  const paypalOptions = {
    'client-id':
      'AW4xSa153VqcBGo7FDFB9SftHMecs8gUxn39_NoRLAeUPL1eRDF5LyS_i_W836sWxd1Q5TXyGPXtJavr',
  };
  //#region : handling paypal payment
  return (
    <PayPalScriptProvider options={paypalOptions}>
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD', // Set currency
                  value: paymentSum, // Set the paymentSum value based on the court type
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          actions.order.capture().then((details) => {
            console.log(details);
            setCheckOut(false); // Close the checkout after approval
            setCompletedPayPalPayment(true); // Set completedPayPalPayment to true
            onPaymentSuccess(true); // Call the onPaymentSuccess callback with true
            // Send a request to your backend to update payment_status to "payed"
            fetch('http://localhost:5000/order/update-payment-status', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                payment_status: 'paid', // Set this to 'payed' when payment is successful
                time_range: time_range,
                date_of_game: date_of_game,
              }),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error('Error updating payment status');
                } else {
                  return response.json();
                }
              })
              .then((data) => {
                console.log('Payment status updated successfully', data);
              })
              .catch((error) => {
                console.error('Error updating payment status', error);
              });
          });
        }}
        onError={(err) => {
          console.error(err);
        }}
      />
    </PayPalScriptProvider>
  );
  //#endregion
}

export default PayPal;
//#endregion
