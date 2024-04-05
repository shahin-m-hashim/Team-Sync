/* eslint-disable react/prop-types */

import { useFormik } from "formik";
import Loading from "../../Loading";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { UserContext } from "@/providers/UserProvider";
import { ErrorContext } from "@/providers/ErrorProvider";
import { primaryUserDataValidationSchema as validationSchema } from "@/validations/userValidations";

export default function PrimaryUserForm({
  setIsEditing,
  setEnablePrimaryEdit,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { userData, updateUserDetails, setReFetchUser } =
    useContext(UserContext);
  const { setError } = useContext(ErrorContext);

  const initialValues = {
    fname: userData?.fname,
    username: userData?.username,
    pronoun: userData?.pronoun,
    tag: userData?.tag,
    bio: userData?.bio,
    socialLinks: userData?.socialLinks,
  };

  const onSubmit = async (values) => {
    if (JSON.stringify(initialValues) === JSON.stringify(values)) {
      toast.info("You have made no changes !!!");
      return;
    }

    setIsLoading(true);
    try {
      await updateUserDetails("primaryDetails", { newPrimaryDetails: values });
      toast.success("Details Updated Successfully");
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
        resetForm();
        console.error(error);
        toast.error("Update failed !!!");
      }
    } finally {
      setIsLoading(false);
      setIsEditing(false);
      setEnablePrimaryEdit(false);
      setReFetchUser((prev) => !prev);
    }
  };

  const {
    errors,
    handleSubmit,
    touched,
    getFieldProps,
    handleChange,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <>
      {isLoading && <Loading />}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <input
            id="fname"
            type="text"
            name="fname"
            placeholder="Your Full Name"
            {...getFieldProps("fname")}
            onChange={(e) => {
              handleChange(e);
              setIsEditing(true);
            }}
            className="w-full p-1 text-slate-800"
          />
          {errors.fname && touched.fname && (
            <span className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.fname}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex gap-1">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="a unique username"
              {...getFieldProps("username")}
              onChange={(e) => {
                handleChange(e);
                setIsEditing(true);
              }}
              className="w-1/2 p-1 text-slate-800"
            />
            <select
              id="pronoun"
              name="pronoun"
              className="w-1/2 text-black"
              {...getFieldProps("pronoun")}
              onChange={(e) => {
                handleChange(e);
                setIsEditing(true);
              }}
            >
              {!userData?.pronoun && (
                <option value="" className="hidden">
                  Pronoun
                </option>
              )}
              <option value="he/him">he/him</option>
              <option value="she/her">she/her</option>
            </select>
          </div>
          {errors.username && touched.username && (
            <span className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.username}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <input
            id="tag"
            type="tag"
            name="tag"
            placeholder="Your Tagline"
            {...getFieldProps("tag")}
            onChange={(e) => {
              handleChange(e);
              setIsEditing(true);
            }}
            className="w-full p-1 text-slate-800"
          />
          {errors.tag && touched.tag && (
            <span className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.tag}
            </span>
          )}
        </div>
        <textarea
          rows={3}
          id="bio"
          name="bio"
          placeholder="Enter Your Bio"
          {...getFieldProps("bio")}
          onChange={(e) => {
            handleChange(e);
            setIsEditing(true);
          }}
          className="p-1 text-slate-800"
        />
        {errors.bio && touched.bio && (
          <span className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.bio}
          </span>
        )}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold text-slate-800">Social Links</h3>
          <input
            type="text"
            name="socialLinks.website"
            placeholder="Website"
            {...getFieldProps("socialLinks.website")}
            onChange={(e) => {
              handleChange(e);
              setIsEditing(true);
            }}
            className="p-1 text-slate-800"
          />
          {errors.socialLinks?.website && touched.socialLinks?.website && (
            <span className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.socialLinks.website}
            </span>
          )}
          <input
            type="text"
            name="socialLinks.linkedIn"
            placeholder="LinkedIn"
            {...getFieldProps("socialLinks.linkedIn")}
            onChange={(e) => {
              handleChange(e);
              setIsEditing(true);
            }}
            className="p-1 text-slate-800"
          />
          {errors.socialLinks?.linkedIn && touched.socialLinks?.linkedIn && (
            <span className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.socialLinks.linkedIn}
            </span>
          )}
          <input
            type="text"
            name="socialLinks.github"
            placeholder="Github"
            {...getFieldProps("socialLinks.github")}
            onChange={(e) => {
              handleChange(e);
              setIsEditing(true);
            }}
            className="p-1 text-slate-800"
          />
          {errors.socialLinks?.github && touched.socialLinks?.github && (
            <span className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.socialLinks.github}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button type="submit" className="w-full px-2 bg-green-500">
            Save
          </button>
          <button
            type="reset"
            onClick={() => resetForm()}
            className="w-full px-2 bg-blue-500"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEnablePrimaryEdit(false);
            }}
            className="w-full px-2 bg-red-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
