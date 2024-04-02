import { useContext, useState } from "react";
import { securitySettingsValidationSchema as validationSchema } from "@/validations/authValidations";
import { useFormik } from "formik";
import { UserContext } from "@/providers/UserProvider";
import { PhoneInput } from "react-international-phone";

/* eslint-disable react/prop-types */
const ContactUserForm = ({ setEnableContactEdit }) => {
  const { userData, updateUserDetails, setReFetchUser } =
    useContext(UserContext);

  const initialValues = {
    secondaryEmail: userData?.secondaryEmail || "",
    phone: userData?.phone || "",
  };

  const [phone, setPhone] = useState(initialValues?.phone?.country);

  const onSubmit = async (values) => {
    console.log(values);
    setEnableContactEdit(false);
  };

  const { errors, handleSubmit, touched, getFieldProps, setFieldValue } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit,
    });
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="secondaryEmail"
          className="block mb-2 text-sm font-medium"
        >
          Secondary Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Your secondary email"
          {...getFieldProps("secondaryEmail")}
          className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
        {errors.secondaryEmail && touched.secondaryEmail && (
          <span className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.secondaryEmail}
          </span>
        )}
      </div>
      <PhoneInput
        defaultCountry="ua"
        value={phone}
        style={{ color: "black" }}
        onChange={(phone) => setPhone(phone)}
      />
      <div className="mb-4">
        <label htmlFor="phone" className="block mb-2 text-sm font-medium">
          Phone Number
        </label>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setEnableContactEdit(false)}
          className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ContactUserForm;
