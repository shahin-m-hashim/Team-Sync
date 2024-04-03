import { useFormik } from "formik";
import { useContext, useState } from "react";
import { UserContext } from "@/providers/UserProvider";
import { contactSettingsValidationSchema as validationSchema } from "@/validations/authValidations";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const ContactUserForm = ({ enableContactEdit, setEnableContactEdit }) => {
  const [phone, setPhone] = useState();
  const { userData, updateUserDetails, setReFetchUser } =
    useContext(UserContext);

  const initialValues = {
    secondaryEmail: userData?.secondaryEmail || "",
    phone: userData?.phone || { countryCode: "IN", number: "0000000000" },
  };

  const onSubmit = async (values) => {
    console.log(values);
    const formData = {
      secondaryEmail: values?.secondaryEmail,
      phone: {
        countryCode: formData?.phone?.countryCode,
        number: formData?.phone?.number,
      },
    };
    console.log(formData);

    setEnableContactEdit(false);
  };

  const { errors, handleSubmit, getFieldProps } = useFormik({
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
          id="secondaryEmail"
          type="email"
          name="secondaryEmail"
          placeholder="Your secondary email"
          {...getFieldProps("secondaryEmail")}
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
        {errors.secondaryEmail && (
          <span className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.secondaryEmail}
          </span>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="phone" className="block mb-2 text-sm font-medium">
          Phone Number
        </label>
        <PhoneInput
          id="phone"
          name="phone"
          defaultCountry="IN"
          international
          disabled={!enableContactEdit}
          value={initialValues?.phone?.countryCode}
          onChange={(value) => {
            const countryCode = value?.slice(0, 3) || ""; // Ensure empty string if value is undefined
            const number = value?.slice(3) || ""; // Ensure empty string if value is undefined
            setPhone({ phone: { countryCode, number } });
          }}
          placeholder="Enter phone number"
          className="h-10 text-black"
        />
        {errors.phone?.countryCode && (
          <span className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.phone?.countryCode}
          </span>
        )}
        {errors.phone?.number && (
          <span className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.phone?.number}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-10">
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
