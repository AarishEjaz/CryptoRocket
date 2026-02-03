import { ethers } from "ethers";

/**
 * Validates the password input to ensure it is not empty and meets the minimum length requirement.
 *
 * @param {string} password - The password input to be validated.
 * @returns {string} - An error message if the password is empty or too short, otherwise an empty string.
 */
export function passwordValidator(password) {
  if (!password) return "Password can't be empty.";

  // Minimum length requirement
  if (password.length < 8)
    return "Password must be at least 8 characters long.";

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter.";

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password))
    return "Password must contain at least one lowercase letter.";

  // Check for at least one digit
  if (!/[0-9]/.test(password))
    return "Password must contain at least one digit.";

  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
    return "Password must contain at least one special character.";

  return ""; // Return an empty string if all validations pass
}

// old
// export function passwordValidator(password) {
//     if (!password) return "Password can't be empty.";
//     if (password.length < 5)
//         return "Password must be at least 5 characters long.";
//     return "";
// }

/**
 * Validates the name input to ensure it is not empty.
 *
 * @param {string} name - The name input to be validated.
 * @returns {string} - An error message if the name is empty, otherwise an empty string.
 */
export function nameValidator(name) {
  if (!name) return "Name can't be empty.";
  return "";
}

/**
 * Validates the email input to ensure it is not empty, is a valid email format, and does not contain spaces.
 *
 * @param {string} email - The email input to be validated.
 * @returns {string} - An error message if the email is empty, invalid, or contains spaces, otherwise an empty string.
 */
export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/;
  if (!email) return "Email can't be empty.";
  if (!re.test(email)) return "Oops! We need a valid email address.";
  if (email.indexOf(" ") !== -1) return "Email cannot contain spaces.";
  return "";
}

/**
 * Validates the phone number input to ensure it is not empty and is a valid 10-digit number.
 *
 * @param {string} phone - The phone number input to be validated.
 * @returns {string} - An error message if the phone number is empty or invalid, otherwise an empty string.
 */
export function phoneValidator(phone, required = true) {
  if (required && !phone) return "Phone number can't be empty.";

  const trimmed = phone?.trim();
  const isValidPhone = /^[6-9]\d{9}$/;

  if (!isValidPhone.test(trimmed))
    return "Please enter a valid 10-digit mobile number.";

  return null; // No error
}

/**
 * Validates the OTP input to ensure it is not empty and is a 4-digit number.
 *
 * @param {string} otp - The OTP input to be validated.
 * @returns {string} - An error message if OTP is empty or not a 4-digit number, otherwise an empty string.
 */
export function otpValidator(otp) {
  const isValidOTP = /^\d{4}$/;
  if (!otp) return "OTP can't be empty.";
  if (!isValidOTP.test(otp)) return "OTP must be a 4-digit number.";
  return "";
}

/**
 * Validates a generic field input to ensure it is not empty.
 *
 * @param {string} value - The field input to be validated.
 * @returns {string} - An error message if the field is empty, otherwise an empty string.
 */
export function fieldValidator(value, required = true) {
  if (required && !value) return "This Field can't be empty.";
  return "";
}

/**
 * Validates the tags input to ensure it is not empty and does not exceed the maximum limit.
 *
 * @param {string} tags - The tags input to be validated.
 * @returns {string} - An error message if the tags are empty or exceed the maximum limit, otherwise an empty string.
 */
export function tagValidator(tags) {
  if (!tags) return "This Field can't be empty.";
  if (tags.split(",").length > 15) return "Max 15 tags allowed";
  return "";
}

/**
 * Validates the images input to ensure it is not empty.
 *
 * @param {Object} images - The images input to be validated.
 * @returns {string} - An error message if the images are empty, otherwise an empty string.
 */
export function imagesValidator(images) {
  if (
    !images.mainImage ||
    !images.leftSideImage ||
    !images.rightSideImage ||
    !images.topViewImage ||
    !images.bottomViewImage ||
    !images.backImage ||
    !images.benefitsImage ||
    !images.highlightImage ||
    !images.otherImage
  )
    return "Please upload all the images.";
  return "";
}

/**
 * Validates the number input to ensure it is not empty and is a valid number.
 *
 * @param {string} number - The number input to be validated.
 * @returns {string} - An error message if the number is empty or invalid, otherwise an empty string.
 */
export function numberValidator(number, limit, required = true) {
  if (required && !number) return "This field can't be empty.";
  if (isNaN(number)) return "Please enter a valid number.";
  if (number < 0) return "This field can't be negative.";
  if (limit && number > limit) return `Number can't be more than ${limit}.`;
  return "";
}

export function pincodeValidator(pincode, required = true) {
  // Check if the pincode is required and empty
  if (required && !pincode) return "Pincode can't be empty.";

  // Ensure the pincode contains only digits and is exactly 6 digits long
  const isValidPincode = /^\d{6}$/;
  if (!/^\d+$/.test(pincode))
    return "Pincode must contain only numeric digits.";
  if (!isValidPincode.test(pincode))
    return "Please enter a valid 6-digit pincode.";

  return ""; // Return an empty string if all validations pass
}

export function gstValidator(gstNumber) {
  // Check if the GST number is provided
  if (!gstNumber) return "GST number can't be empty.";

  // Define the regex pattern for GST validation
  // Example: 12ABCDE1234F1Z5
  const gstPattern =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z][A-Z0-9]{1}$/;

  // Test the GST number against the pattern
  if (!gstPattern.test(gstNumber)) {
    return "Please enter a valid GST number.";
  }

  return ""; // Return an empty string if all validations pass
}

export function panValidator(panNumber) {
  // Check if the PAN number is provided
  if (typeof panNumber !== "string" || !panNumber.trim()) {
    return "PAN number can't be empty.";
  }

  // Trim any extra spaces around the PAN number
  panNumber = panNumber.trim();

  // Define the regex pattern for PAN validation
  // Example: ABCDE1234F
  const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  // Test the PAN number against the pattern
  if (!panPattern.test(panNumber)) {
    return "Please enter a valid PAN number.";
  }

  return ""; // Return an empty string if all validations pass
}
export function aadhaarValidator(aadhaarNumber) {
  // Check if the Aadhaar number is provided
  if (typeof aadhaarNumber !== "string" || !aadhaarNumber.trim()) {
    return "Aadhaar number can't be empty.";
  }

  // Trim any extra spaces around the Aadhaar number
  aadhaarNumber = aadhaarNumber.trim();

  // Define the regex pattern for Aadhaar validation
  // Aadhaar is a 12-digit numeric value (cannot start with 0 or 1 optionally)
  const aadhaarPattern = /^[2-9]{1}[0-9]{11}$/;

  // Test the Aadhaar number against the pattern
  if (!aadhaarPattern.test(aadhaarNumber)) {
    return "Please enter a valid 12-digit Aadhaar number.";
  }

  return ""; // Return an empty string if all validations pass
}

/**
 * Validates an Indian IFSC code.
 *
 * @param {string} ifsc - The IFSC code to validate.
 * @returns {string} - An error message if validation fails, otherwise an empty string.
 */
export function ifscValidator(ifsc) {
  // Check if the IFSC code is provided
  if (!ifsc) return "IFSC code can't be empty.";

  // Define the regex pattern for IFSC code validation
  // Allows digits in the branch code
  const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{7}$/;

  // Test the IFSC code against the pattern
  if (!ifscPattern.test(ifsc)) {
    return "Please enter a valid IFSC code.";
  }

  return ""; // Return an empty string if all validations pass
}

export function validateLatitude(latitude) {
  // Check if latitude is provided
  if (latitude === undefined || latitude === "") {
    return "Latitude can't be empty.";
  }

  // Check if the input is a valid number
  const lat = parseFloat(latitude);
  if (isNaN(lat)) {
    return "Latitude must be a number.";
  }

  // Validate if the number is within the valid latitude range
  if (lat < -90 || lat > 90) {
    return "Latitude must be between -90 and 90.";
  }

  // Additional check to ensure no non-numeric characters
  if (!/^-?\d*\.?\d+$/.test(latitude)) {
    return "Latitude must be a valid number (integer or float).";
  }

  return ""; // Return an empty string if all validations pass
}

export function validateLongitude(longitude) {
  // Check if longitude is provided
  if (longitude === undefined || longitude === "") {
    return "Longitude can't be empty.";
  }

  // Check if the input is a valid number
  const lon = parseFloat(longitude);
  if (isNaN(lon)) {
    return "Longitude must be a number.";
  }

  // Validate if the number is within the valid longitude range
  if (lon < -180 || lon > 180) {
    return "Longitude must be between -180 and 180.";
  }

  // Additional check to ensure no non-numeric characters
  if (!/^-?\d*\.?\d+$/.test(longitude)) {
    return "Longitude must be a valid number (integer or float).";
  }

  return ""; // Return an empty string if all validations pass
}

/**
 * Validates the account holder's name.
 *
 * @param {string} accountHolderName - The account holder's name input.
 * @returns {string} - Error message if invalid, otherwise an empty string.
 */
export function accountHolderNameValidator(accountHolderName) {
  if (!accountHolderName) return "Account Holder Name can't be empty.";
  return "";
}

/**
 * Validates the account number.
 *
 * @param {string} accountNumber - The account number input.
 * @returns {string} - Error message if invalid, otherwise an empty string.
 */
export function accountNumberValidator(accountNumber) {
  const isValidAccountNumber = /^\d{9,16}$/; // Account number should be between 12-16 digits
  if (!accountNumber) return "Account Number can't be empty.";
  if (!isValidAccountNumber.test(accountNumber))
    return "Account Number must be between 9 and 16 digits.";
  return "";
}

/**
 * Validates the IFSC code.
 *
 * @param {string} ifscCode - The IFSC code input.
 * @returns {string} - Error message if invalid, otherwise an empty string.
 */
export function ifscCodeValidator(ifscCode) {
  const isValidIfsc = /^[A-Za-z]{4}0[A-Za-z0-9]{5}$/; // IFSC code pattern
  if (!ifscCode) return "IFSC Code can't be empty.";
  if (!isValidIfsc.test(ifscCode)) return "Invalid IFSC Code.";
  return "";
}

/**
 * Validates the branch name.
 *
 * @param {string} branch - The branch input.
 * @returns {string} - Error message if invalid, otherwise an empty string.
 */
export function branchValidator(branch) {
  if (!branch) return "Branch can't be empty.";
  return "";
}

/**
 * Validates the bank name.
 *
 * @param {string} bankName - The bank name input.
 * @returns {string} - Error message if invalid, otherwise an empty string.
 */
export function bankNameValidator(bankName) {
  if (!bankName) return "Bank Name can't be empty.";
  return "";
}

/**
 * Validates the UPI holder name.
 *
 * @param {string} upiHolderName - The UPI holder name input.
 * @returns {string} - Error message if invalid, otherwise an empty string.
 */
export function upiHolderNameValidator(upiHolderName) {
  if (!upiHolderName) return "UPI Holder Name can't be empty.";
  return "";
}

/**
 * Validates the UPI address.
 *
 * @param {string} upiAddress - The UPI address input.
 * @returns {string} - Error message if invalid, otherwise an empty string.
 */
export function upiAddressValidator(upiAddress) {
  // const isValidUpi = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Valid UPI address format
  if (!upiAddress) return "UPI Address can't be empty.";
  // if (!isValidUpi.test(upiAddress)) return "Invalid UPI Address.";
  return "";
}

/**
 * Validates the UPI QR code file.
 *
 * @param {Object} qrCode - The UPI QR code file input.
 * @returns {string} - Error message if invalid, otherwise an empty string.
 */
export function upiQrCodeValidator(qrCode) {
  if (qrCode && !/\.(jpg|jpeg|png)$/i.test(qrCode.name))
    return "QR Code must be an image file (jpg, jpeg, or png).";
  return "";
}


export const validateWalletAddress = (address) => {
  if (!address) return "Wallet address can't be empty.";
  const isValid = ethers.isAddress(address);
  return isValid ? "" : "Please enter a valid wallet address.";
};
