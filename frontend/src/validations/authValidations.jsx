import * as Yup from "yup";
import { usernameValidation } from "./userValidations";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const passwordValidation = Yup.string()
  .min(8, "Password must be at least 8 characters long")
  .max(20, "Password cannot exceed 20 characters")
  .matches(/[0-9]/, "Password must contain at least one number")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[^\w]/, "Password must contain at least one special character")
  .required("Password is required");

const emailValidation = Yup.string()
  .matches(emailRegex, "Invalid email address")
  .required("Email is required");

const cPasswordValidation = Yup.string()
  .oneOf([Yup.ref("password"), null], "Passwords do not match")
  .required("Password is required");

const signupValidationSchema = Yup.object({
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
  cPassword: cPasswordValidation,
});

const loginValidationSchema = Yup.object({
  email: emailValidation,
  password: passwordValidation,
});

const forgotPasswordEmailValidationSchema = Yup.object({
  email: emailValidation,
});

const securitySettingsValidationSchema = Yup.object({
  phone: Yup.object().shape({
    countryCode: Yup.string()
      .matches(/^\+\d{1,4}$/, "Invalid country code")
      .max(5, "A country code cannot exceed 5 characters"),
    number: Yup.string()
      .matches(/^\d{10,}$/, "Invalid Phone No.")
      .max(15, "A phone no. cannot exceed 15 characters"),
  }),
  secondaryEmail: emailValidation,
});

const resetPasswordValidationSchema = Yup.object({
  password: passwordValidation,
  cPassword: cPasswordValidation,
});

export {
  emailValidation,
  passwordValidation,
  loginValidationSchema,
  signupValidationSchema,
  resetPasswordValidationSchema,
  securitySettingsValidationSchema,
  forgotPasswordEmailValidationSchema,
};
