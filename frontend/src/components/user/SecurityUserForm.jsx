/* eslint-disable react/prop-types */
import { useFormik } from "formik";
import { securitySettingsValidationSchema as validationSchema } from "@/validations/authValidations";

const SecurityUserForm = ({ setEnableSecurityEdit }) => {
  const initialValues = {
    currentPassword: "",
    newPassword: "",
    cNewPassword: "",
  };

  const onSubmit = async (values) => {
    console.log(values);
    setEnableSecurityEdit(false);
  };

  const { errors, handleSubmit, touched, getFieldProps } = useFormik({
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
          className="w-full px-3 py-2 border text-black placeholder:text-black border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
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
        <input
          id="newPassword"
          type="password"
          name="newPassword"
          placeholder="Enter a new secure password"
          {...getFieldProps("newPassword")}
          className="w-full px-3 py-2 border text-black placeholder:text-black border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
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
        <input
          id="cNewPassword"
          type="password"
          name="cNewPassword"
          placeholder="Confirm your new password"
          {...getFieldProps("cNewPassword")}
          className="w-full px-3 py-2 border text-black placeholder:text-black border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
        {errors.cNewPassword && touched.cNewPassword && (
          <span className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.cNewPassword}
          </span>
        )}
      </div>
      <div className="mt-10 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setEnableSecurityEdit(false)}
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
