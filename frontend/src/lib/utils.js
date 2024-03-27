import { clsx } from "clsx";
import CryptoJS from "crypto-js";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

let secretKey = "";

const lowStrengthSecretKey = import.meta.env.VITE_LESS_SECURE_LS_KEY;
const mediumStrengthSecretKey = import.meta.env.VITE_MEDIUM_SECURE_LS_KEY;
const highStrengthSecretKey = import.meta.env.VITE_HIGH_SECURE_LS_KEY;

const chooseSecretKey = (strength = "low") => {
  if (strength === "low") {
    return lowStrengthSecretKey;
  } else if (strength === "medium") {
    return mediumStrengthSecretKey;
  } else if (strength === "high") {
    return highStrengthSecretKey;
  } else {
    return null;
  }
};

// Function to encrypt and store data in localStorage
export const setLocalSecureItem = (key, value, strength) => {
  secretKey = chooseSecretKey(strength);
  const stringValue = JSON.stringify(value);

  try {
    const encryptedValue = CryptoJS.AES.encrypt(
      stringValue,
      secretKey
    ).toString();
    localStorage.setItem(key, encryptedValue);
  } catch (e) {
    console.log(`Error in encrypting key ${key} and storing data: ${e}`);
  }
};

// Function to retrieve and decrypt data from localStorage
export const getLocalSecureItem = (key, strength) => {
  secretKey = chooseSecretKey(strength);

  try {
    const encryptedValue = localStorage.getItem(key);
    if (encryptedValue) {
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
      const decryptedValue = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedValue);
    }
    return null;
  } catch (e) {
    console.error(`Error retrieving key ${key} and decrypting data: ${e}`);
    return null;
  }
};

export const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};
