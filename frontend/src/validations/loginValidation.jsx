import * as Yup from "yup";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validationSchema = Yup.object({
  email: Yup.string()
    .required("Required")
    .matches(emailRegex, "Invalid email address"),
  password: Yup.string()
    .min(8, "Password must be 8 characters long")
    .max(20, "Password can only be 20 characters long")
    .matches(/[0-9]/, "Password requires at least one number")
    .matches(/[a-z]/, "Password requires at least one lowercase letter")
    .matches(/[A-Z]/, "Password requires at least one uppercase letter")
    .matches(/[^\w]/, "Password requires at least one symbol")
    .required("Required"),
});
