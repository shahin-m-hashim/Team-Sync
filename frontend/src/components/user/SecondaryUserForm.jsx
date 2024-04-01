/* eslint-disable react/prop-types */

import { cn } from "@/lib/utils";
import Loading from "../Loading";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import ReactFlagsSelect from "react-flags-select";
import { UserContext } from "@/providers/UserProvider";
import { useContext, useState } from "react";
import { secondaryUserDataValidationSchema as validationSchema } from "@/validations/userValidations";
import SuccessfullUpdateAlert from "../toasts/SuccessfullUpdateAlert";
import FailedUpdateAlert from "../toasts/FailedUpdateAlert";

export default function SecondaryUserForm({
  enableSecondaryEdit,
  setEnableSecondaryEdit,
}) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(null);

  const { secondaryData, updateData } = useContext(UserContext);

  const initialValues = {
    address: secondaryData?.address,
    occupation: secondaryData?.occupation,
    organization: secondaryData?.organization,
  };

  const [selected, setSelected] = useState(initialValues?.address?.country);

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      await updateData("secondaryDetails", { newSecondaryDetails: values });
      setIsUpdateSuccess("success");
    } catch (error) {
      resetForm();
      setIsUpdateSuccess("failed");
      if (error.response?.status === 401) {
        {
          localStorage.clear();
          navigate("/unauthorized", { replace: true });
        }
      } else if (
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error" ||
        error.response?.status === 500
      ) {
        navigate("/serverError", { replace: true });
      } else {
        console.error(error);
      }
    } finally {
      setIsLoading(false);
      setEnableSecondaryEdit(false);
    }
  };

  const {
    errors,
    handleSubmit,
    touched,
    getFieldProps,
    setFieldValue,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    secondaryData && (
      <main className="relative px-10 py-5 bg-gray-600 size-full">
        {isLoading && (
          <div className="absolute inset-0 z-50 backdrop-blur-[1px]">
            <Loading />
          </div>
        )}
        {isUpdateSuccess === "success" ? (
          <SuccessfullUpdateAlert/>
        ) : (
          isUpdateSuccess === "failed" && (
            <FailedUpdateAlert/>
          )
        )}
        <span className="text-3xl">YOUR PUBLIC PROFILE</span>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5 mt-10">
          <div className="flex flex-col flex-1 gap-7">
            <h1 className="font-mono text-lg underline underline-offset-8">
              Contact Info
            </h1>
            <div className="flex flex-col gap-2">
              <span>Phone Number</span>
              <div className="flex gap-1">
                <div className="px-4 py-2 font-semibold text-black bg-blue-300 rounded-md">
                  {secondaryData?.phone?.countryCode || "+91"}
                </div>
                <div className="w-full p-2 text-black bg-blue-300 rounded-md">
                  {secondaryData?.phone?.number || "0000000000"}
                </div>
              </div>
              {enableSecondaryEdit && (
                <span className="text-sm text-red-600 dark:text-red-400">
                  You can change your phone number in the security page
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <span>Email Address</span>
              <div className="p-2 text-black bg-blue-300 rounded-md text">
                {secondaryData?.email || "Your current email address"}
              </div>
              {enableSecondaryEdit && (
                <span className="text-sm text-red-600 dark:text-red-400">
                  You cannot change your primary email address !!!
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <span>Address</span>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col">
                  <input
                    type="text"
                    id="address.district"
                    name="address.district"
                    disabled={!enableSecondaryEdit}
                    placeholder="Your current district"
                    {...getFieldProps("address.district")}
                    className={cn(
                      enableSecondaryEdit
                        ? "placeholder:text-gray-600"
                        : "placeholder:text-black",
                      "p-2 text-black bg-blue-300 rounded-md focus:bg-blue-300 "
                    )}
                  />
                  {errors.address?.district && touched.address?.district && (
                    <span className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.address?.district}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <input
                    type="text"
                    id="address.state"
                    name="address.state"
                    disabled={!enableSecondaryEdit}
                    placeholder="Your current state"
                    {...getFieldProps("address.state")}
                    className={cn(
                      enableSecondaryEdit
                        ? "placeholder:text-gray-600"
                        : "placeholder:text-black",
                      "p-2 text-black bg-blue-300 rounded-md"
                    )}
                  />
                  {errors.address?.state && touched.address?.state && (
                    <span className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.address?.state}
                    </span>
                  )}
                </div>
                <ReactFlagsSelect
                  id="country"
                  name="address.country"
                  disabled={!enableSecondaryEdit}
                  selected={selected}
                  onSelect={(code) => {
                    setSelected(code);
                    setFieldValue("address.country", code);
                  }}
                  className="p-1 font-semibold bg-blue-300 rounded-md"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-7">
            <h1 className="font-mono text-lg underline underline-offset-8">
              Professional Info
            </h1>
            <div className="flex flex-col gap-2">
              <span>Occupation</span>
              <input
                type="text"
                id="occupation"
                name="occupation"
                disabled={!enableSecondaryEdit}
                placeholder="Your current occupation"
                {...getFieldProps("occupation")}
                className={cn(
                  enableSecondaryEdit
                    ? "placeholder:text-gray-600"
                    : "placeholder:text-black",
                  "p-2 text-black bg-blue-300 rounded-md text"
                )}
              />
              {errors.occupation && touched.occupation && (
                <span className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.occupation}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <span>Company/Organization</span>
              <input
                type="text"
                id="organization"
                disabled={!enableSecondaryEdit}
                name="organization"
                placeholder="Your current organization"
                {...getFieldProps("organization")}
                className={cn(
                  enableSecondaryEdit
                    ? "placeholder:text-gray-600"
                    : "placeholder:text-black",
                  "p-2 text-black bg-blue-300 rounded-md text"
                )}
              />
              {errors.organization && touched.organization && (
                <span className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.organization}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {enableSecondaryEdit ? "Done Editing ?" : "Edit Your Profile"}
              {!enableSecondaryEdit ? (
                <button
                  type="button"
                  onClick={() => setEnableSecondaryEdit(true)}
                  className="w-full p-2 text-white bg-blue-500 rounded-sm hover:bg-blue-600"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="submit"
                    value={
                      enableSecondaryEdit ? "Save Changes" : "Edit Profile"
                    }
                    className="w-full p-2 bg-green-600 rounded-sm hover:bg-green-500"
                  />
                  <input
                    type="reset"
                    onClick={() => {
                      resetForm();
                      setSelected(secondaryData?.address?.country);
                    }}
                    className="w-full p-2 text-white bg-blue-500 rounded-sm hover:bg-blue-600"
                  />
                  <input
                    type="button"
                    value="Cancel"
                    onClick={() => {
                      resetForm();
                      setSelected(secondaryData?.address?.country);
                      setEnableSecondaryEdit(false);
                    }}
                    className="w-full p-2 text-white bg-red-500 rounded-sm hover:bg-red-600"
                  />
                </div>
              )}
            </div>
          </div>
        </form>
        <div className="mt-10 space-y-6">
          <div>
            <h1 className="mb-1 text-lg font-semibold">Delete Account</h1>
            <span className="text-sm">
              Once you delete your account, there is no going back. Please be
              certain.
            </span>
          </div>
          <button
            type="button"
            className="p-2 bg-red-600 rounded-sm hover:bg-red-500"
          >
            Delete Your Account
          </button>
        </div>
      </main>
    )
  );
}
