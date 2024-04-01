/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { useFormik } from "formik";
import { UserContext } from "@/providers/UserProvider";
import { primaryUserDataValidationSchema as validationSchema } from "@/validations/userValidations";
import { useNavigate } from "react-router-dom";
import SuccessfullUpdateAlert from "../toasts/SuccessfullUpdateAlert";
import FailedUpdateAlert from "../toasts/FailedUpdateAlert";
import Loading from "../Loading";

export default function PrimaryUserForm({ setEnablePrimaryEdit }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(null);

  const { primaryData, updateData, setReFetch } = useContext(UserContext);

  const initialValues = {
    fname: primaryData?.fname,
    username: primaryData?.username,
    pronoun: primaryData?.pronoun,
    tag: primaryData?.tag,
    bio: primaryData?.bio,
    socialLinks: primaryData?.socialLinks,
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      await updateData("primaryDetails", { newPrimaryDetails: values });
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
      setReFetch((prev) => !prev);
      setIsLoading(false);
      setEnablePrimaryEdit(false);
    }
  };

  const { errors, handleSubmit, touched, getFieldProps, resetForm } = useFormik(
    {
      initialValues,
      validationSchema,
      onSubmit,
    }
  );

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 z-50 backdrop-blur-[1px]">
          <Loading />
        </div>
      )}
      {isUpdateSuccess === "success" ? (
        <SuccessfullUpdateAlert />
      ) : (
        isUpdateSuccess === "failed" && <FailedUpdateAlert />
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <input
            id="fname"
            type="text"
            name="fname"
            placeholder="Your Full Name"
            {...getFieldProps("fname")}
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
              className="w-1/2 p-1 text-slate-800"
            />
            <select
              id="pronoun"
              name="pronoun"
              className="w-1/2 text-black"
              {...getFieldProps("pronoun")}
            >
              {!primaryData?.pronoun && (
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
            placeholder="Twitter"
            {...getFieldProps("socialLinks.github")}
            className="p-1 text-slate-800"
          />
          {errors.socialLinks?.github && touched.socialLinks?.github && (
            <span className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.socialLinks.github}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button type="submit" className="px-2 bg-green-500">
            Save
          </button>
          <button
            type="reset"
            onClick={() => resetForm}
            className="px-2 bg-blue-500"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => setEnablePrimaryEdit(false)}
            className="px-2 bg-red-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
