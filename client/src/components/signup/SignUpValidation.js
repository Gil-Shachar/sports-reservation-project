function valiSignUpInput(input) {
  // Regular expression for name and lastname validation
  const nameRegex = /^[A-Za-z]{3,14}$/;
  // Name and lastname must consist of 3 to 14 letters (no numbers)

  // Regular expression for phone number validation
  const phoneNumberRegex = /^\d{10}$/;
  // Phone number must consist of exactly 10 digits

  // Regular expression for email validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  // Valid email address format

  // Regular expression for date of birth validation (YYYY-MM-DD format)
  const dateOfBirthRegex =
    /^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  // Date of birth should be in the past and follow the YYYY-MM-DD format

  // Regular expression for username validation
  const usernameRegex = /^[A-Za-z0-9]{4,14}$/;
  // Username must consist of 4 to 14 alphanumeric characters

  // Regular expression for password validation
  const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{4,15}$/;
  // Password must consist of 4 to 15 characters, with at least one number and one capital letter

  const errors = [];

  if (!nameRegex.test(input.name)) {
    errors.push('Name must be between 3 and 14 letters (no numbers).');
  }

  if (!phoneNumberRegex.test(input.phone_number)) {
    errors.push('Phone number must be exactly 10 digits.');
  }

  if (!emailRegex.test(input.email)) {
    errors.push('Invalid email address.');
  }

  if (!dateOfBirthRegex.test(input.date_of_birth)) {
    errors.push('Invalid date of birth format.');
  } else {
    const currentDate = new Date().toISOString().split('T')[0];
    if (input.date_of_birth > currentDate) {
      errors.push('Date of birth cannot be a future date.');
    }
  }

  if (!usernameRegex.test(input.username)) {
    errors.push('Username must be between 4 and 14 characters.');
  }

  if (!passwordRegex.test(input.password)) {
    errors.push(
      'Password must be between 4 and 15 characters and contain at least one number and one capital letter.'
    );
  }

  return errors;
}

module.exports = { valiSignUpInput };
