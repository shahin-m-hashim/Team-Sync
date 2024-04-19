/* eslint-disable react/prop-types */
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import "react-international-phone/style.css";
import { UserContext } from "@/providers/UserProvider";
import { PhoneInput } from "react-international-phone";
import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const isPhoneValid = (phone) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const ContactUserForm = ({
  setIsEditing,
  setIsContactLoading,
  setEnableContactEdit,
}) => {
  const { setError } = useContext(UserContext);
  const { user, updateUserDetails, setReFetchUser } = useContext(UserContext);

  const initialValues = {
    secondaryEmail: user?.secondaryEmail || "",
    phone: {
      countryCode: user?.phone?.countryCode || "+91",
      number: user?.phone?.number || "",
    },
  };

  const [phone, setPhone] = useState(
    user?.phone?.countryCode + user?.phone?.number || ""
  );
  const [secondaryEmail, setSecondaryEmail] = useState(
    initialValues.secondaryEmail
  );

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPhnValid, setIsPhnValid] = useState(true);

  const handleEmailChange = (e) => {
    setIsEditing(true);
    const email = e.target.value;
    setSecondaryEmail(email);
    setIsEmailValid(!email || email.match(emailRegex));
  };

  const handlePhoneChange = (value) => {
    setIsEditing(true);
    setPhone(value);
    setIsPhnValid(!value || isPhoneValid(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let number = "";
    let countryCode = "+91";

    try {
      countryCode = `+${phoneUtil.parse(phone).getCountryCode()}`;
      number = phone.replace(countryCode, "");
    } catch (e) {
      // eslint-disable-next-line no-empty
    }

    const newContactDetails = {
      secondaryEmail,
      phone: { countryCode, number },
    };

    if (!isEmailValid || !isPhnValid) return;

    if (JSON.stringify(initialValues) === JSON.stringify(newContactDetails)) {
      toast.info("You have made no changes !!!");
      return;
    }

    try {
      setIsContactLoading(true);
      await updateUserDetails("contactDetails", { newContactDetails });
      toast.success("Update Successfull");
    } catch (error) {
      if (error.response?.status === 401) {
        setError("unauthorized");
      } else if (
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error" ||
        error.response?.status === 500
      ) {
        setError("serverError");
      } else {
        toast.error("Update failed !!!");
        console.error(error);
      }
    } finally {
      setIsEditing(false);
      setIsContactLoading(false);
      setEnableContactEdit(false);
      setReFetchUser((prev) => !prev);
    }
  };

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
          type="email"
          id="secondaryEmail"
          name="secondaryEmail"
          value={secondaryEmail}
          onChange={handleEmailChange}
          placeholder={"Your secondary email"}
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
        {secondaryEmail && !isEmailValid && (
          <span className="mt-1 text-sm text-red-600 dark:text-red-400">
            Invalid email address
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
          defaultCountry="in"
          international
          className="phoneInp"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="Enter phone number"
        />
        {phone && !isPhnValid && (
          <span className="mt-1 text-sm text-red-600 dark:text-red-400">
            Invalid phone number
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-10">
        <button
          type="button"
          onClick={() => {
            setEnableContactEdit(false);
            setIsEditing(false);
          }}
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
