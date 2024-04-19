/* eslint-disable react/prop-types */

import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useContext, useRef, useState } from "react";
import { UserContext } from "@/providers/UserProvider";
import showPass from "../../../assets/images/ShowPass.png";
import hidePass from "../../../assets/images/HidePass.png";
import { securitySettingsValidationSchema as validationSchema } from "@/validations/authValidations";

const SecurityUserForm = ({
  setIsEditing,
  setIsSecurityLoading,
  setEnableSecurityEdit,
}) => {
  const { setError } = useContext(UserContext);
  const { updateUserDetails, setReFetchUser } = useContext(UserContext);

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    cNewPassword: "",
  };

  const newPasswordRef = useRef();
  const cNewPasswordRef = useRef();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCNewPassword, setShowCNewPassword] = useState(false);

  const onSubmit = async (values) => {
    setIsSecurityLoading(true);
    // eslint-disable-next-line no-unused-vars
    const { cNewPassword, ...rest } = values;
    try {
      await updateUserDetails("securityDetails", { newSecurityDetails: rest });
      toast.success("Details Updated Successfully");
      setEnableSecurityEdit(false);
    } catch (error) {
      console.log(error.message);

      if (error.response?.status === 401) {
        setError("unauthorized");
      } else if (
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error" ||
        error.response?.status === 500
      ) {
        setError("serverError");
      } else if (error.message === "Invalid password") {
        toast.error("Invalid password, Please try again");
      } else {
        toast.error("Update failed !!!");
        console.error(error);
        setEnableSecurityEdit(false);
      }
    } finally {
      setIsEditing(false);
      setIsSecurityLoading(false);
      setReFetchUser((prev) => !prev);
    }
  };

  const { errors, handleSubmit, touched, getFieldProps, handleChange } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit,
    });

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="currentPassword"
          className="block mb-2 text-sm font-medium"
        >
          Current Password
        </label>
        <input
          id="currentPassword"
          type="password"
          name="currentPassword"
          placeholder="Enter your current password"
          {...getFieldProps("currentPassword")}
          onChange={(e) => {
            handleChange(e);
            setIsEditing(true);
          }}
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md placeholder:text-black focus:outline-none focus:border-indigo-500"
        />
        {errors.currentPassword && touched.currentPassword && (
          <span className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.currentPassword}
          </span>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="newPassword" className="block mb-2 text-sm font-medium">
          New Password
        </label>
        <div className="relative flex items-center justify-center w-full">
          <input
            id="newPassword"
            ref={newPasswordRef}
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            placeholder="Enter a new secure password"
            {...getFieldProps("newPassword")}
            onChange={(e) => {
              handleChange(e);
              setIsEditing(true);
            }}
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-md placeholder:text-black focus:outline-none focus:border-indigo-500"
          />
          <img
            className="absolute cursor-pointer size-8 right-3"
            onClick={() => {
              setShowNewPassword(!showNewPassword);
            }}
            src={showNewPassword ? showPass : hidePass}
          />
        </div>
        {errors.newPassword && touched.newPassword && (
          <span className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.newPassword}
          </span>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="cNewPassword"
          className="block mb-2 text-sm font-medium"
        >
          Confirm New Password
        </label>
        <div className="relative flex items-center justify-center w-full">
          <input
            id="cNewPassword"
            ref={cNewPasswordRef}
            type={showCNewPassword ? "text" : "password"}
            name="cNewPassword"
            placeholder="Confirm your new password"
            {...getFieldProps("cNewPassword")}
            onChange={(e) => {
              handleChange(e);
              setIsEditing(true);
            }}
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-md placeholder:text-black focus:outline-none focus:border-indigo-500"
          />
          <img
            className="absolute cursor-pointer size-8 right-3"
            onClick={() => {
              setShowCNewPassword(!showCNewPassword);
            }}
            src={showCNewPassword ? showPass : hidePass}
          />
        </div>
        {errors.cNewPassword && touched.cNewPassword && (
          <span className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.cNewPassword}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 mt-10">
        <button
          type="button"
          onClick={() => {
            setIsEditing(false);
            setEnableSecurityEdit(false);
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

export default SecurityUserForm;
