/* eslint-disable react/prop-types */
import { useFormik } from "formik";
import { userValidationSchema as validationSchema } from "@/validations/userValidations";
import Navbar from "@/components/dashboard/Navbar";

const FormField = ({
  name = "",
  labelTxt = "",
  placeholder = "",
  type = "text",
  getFieldProps,
  errors,
  touched,
}) => (
  <div className="mb-4">
    <label htmlFor={name} className="block mb-2 text-sm font-medium">
      {labelTxt}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      placeholder={placeholder}
      {...getFieldProps(name)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
      {...getFieldProps("password")}
    />
    {errors[name] && touched[name] && (
      <span className="mt-1 text-sm text-red-600 dark:text-red-400">
        {errors[name]}
      </span>
    )}
  </div>
);

export default function SecuritySettingsPage() {
  const initialValues = {
    primaryEmail: "",
    secondaryEmail: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    cNewPassword: "",
  };

  const onSubmit = async (values) => {
    console.log(values);
  };

  const {
    errors,
    handleSubmit,
    touched,
    getFieldProps,
    isValid,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <>
      <Navbar settings={"min-h-14 m-0 z-10 fixed top-0 left-0 right-0"} />
      <form
        className="h-svh w-svw overflow-auto my-10 text-white rounded-md shadow-md py-14 bg-[#2b2a2a]"
        onSubmit={handleSubmit}
        method="post"
        action="/api/login"
      >
        <h1 className="max-w-6xl mx-auto text-3xl">Sign In And Security</h1>
        <div className="grid max-w-6xl grid-cols-2 mx-auto mt-8 w gap-y-5 gap-x-10">
          <div className="p-10 rounded-md bg-slate-700">
            <div className="mb-8 space-y-2">
              <h1 className="text-xl font-semibold">Primary settings</h1>
              <p className="text-xs text-gray-400">
                Update your account&apos;s security settings
              </p>
            </div>
            <FormField
              name="primaryEmail"
              labelTxt="Primary email"
              placeholder=""
              getFieldProps={getFieldProps}
              errors={errors}
              touched={touched}
            />
            <FormField
              name="secondaryEmail"
              labelTxt="Secondary email"
              placeholder=""
              getFieldProps={getFieldProps}
              errors={errors}
              touched={touched}
            />
            <FormField
              name="phone"
              labelTxt="Phone"
              placeholder=""
              getFieldProps={getFieldProps}
              errors={errors}
              touched={touched}
            />
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="mt-10 flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                />
              </svg>
              <span>&nbsp;Update Info</span>
            </button>
          </div>
          <div className="p-10 rounded-md bg-slate-700">
            <div className="mb-8 space-y-2">
              <h1 className="text-xl font-semibold">Change Password</h1>
              <p className="text-xs text-gray-400">
                Update your account&apos;s password
              </p>
            </div>
            <FormField
              name="currentPassword"
              labelTxt="Current password"
              placeholder=""
              type="password"
              getFieldProps={getFieldProps}
              errors={errors}
              touched={touched}
            />
            <FormField
              name="newPassword"
              labelTxt="New password"
              placeholder=""
              type="password"
              getFieldProps={getFieldProps}
              errors={errors}
              touched={touched}
            />
            <FormField
              name="cNewPassword"
              labelTxt="Confirm new password"
              placeholder=""
              type="password"
              getFieldProps={getFieldProps}
              errors={errors}
              touched={touched}
            />
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="mt-10 flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                />
              </svg>
              <span>&nbsp;Reset Password</span>
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
