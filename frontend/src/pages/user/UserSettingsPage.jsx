/* eslint-disable react/prop-types */
import { useState } from "react";
import { userValidationSchema as validationSchema } from "@/validations/userValidations";
import Navbar from "@/components/dashboard/Navbar";
import { useFormik } from "formik";
import { cn } from "@/lib/utils";
import ChangeUserDp from "@/components/ChangeUserDp";

const InputField = ({
  variety,
  name = "",
  placeholder = "",
  type = "text",
  getFieldProps,
  errors,
  touched,
}) => (
  <>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      {...getFieldProps(name)}
      className={cn(
        variety === "sidebar"
          ? "p-1 text-slate-800"
          : "p-2 text-black bg-blue-300 rounded-md text placeholder:text-gray-600"
      )}
    />
    {errors[name] && touched[name] && <ErrorTxt text={errors[name]} />}
  </>
);

const TextDiv = ({ text }) => (
  <div className="p-2 text-black bg-blue-300 rounded-md text placeholder:text-gray-600">
    {text}
  </div>
);

const ErrorTxt = ({ text }) => (
  <span className="mt-1 text-sm text-red-600 dark:text-red-400">{text}</span>
);

export default function UserSettingsPage() {
  const initialValues = {
    fname: "",
    username: "",
    pronoun: "",
    tag: "",
    bio: "",
    address: {
      district: "",
      state: "",
      country: "",
    },
    occupation: "",
    organization: "",
    socialLinks: {
      website: "",
      linkedIn: "",
      twitter: "",
    },
  };

  const onSubmit = async (values) => {
    resetForm();
    console.log("submitted");
    console.log(values);
    setEnableEdit(false);
  };

  const { errors, handleSubmit, touched, getFieldProps, resetForm } = useFormik(
    {
      initialValues,
      validationSchema,
      onSubmit,
    }
  );

  const [enableEdit, setEnableEdit] = useState(false);

  return (
    <>
      <Navbar settings={"min-h-14 m-0 z-10 fixed top-0 left-0 right-0"} />
      <form
        onSubmit={handleSubmit}
        className=" text-white h-svh w-svw overflow-auto grid grid-cols-[300px,1fr] pt-14 bg-[#2b2a2a]"
      >
        <div className="flex flex-col gap-4 px-10 py-5 bg-gray-500 size-full">
          <h2 className="text-2xl">General</h2>
          <ChangeUserDp />
          <div className="flex flex-col gap-2">
            {!enableEdit ? (
              <span className="text-xl font-semibold text-slate-800">
                Your Full Name
              </span>
            ) : (
              <InputField
                name="fname"
                variety="sidebar"
                placeholder="Your Full Name"
                type="text"
                getFieldProps={getFieldProps}
                errors={errors}
                touched={touched}
              />
            )}
            <div className="flex gap-2 text-sm">
              {!enableEdit ? (
                <span>shahin123</span>
              ) : (
                <input
                  type="text"
                  name="username"
                  placeholder="a unique username"
                  {...getFieldProps("username")}
                  className="w-1/2 p-1 text-slate-800"
                />
              )}
              {enableEdit && (
                <select
                  name="pronoun"
                  className="w-1/2 text-black"
                  value={getFieldProps("pronoun").value}
                  onChange={getFieldProps("pronoun").onChange}
                >
                  <option value="" className="hidden">
                    Pronoun
                  </option>
                  <option value="he/him">he/him</option>
                  <option value="she/her">she/her</option>
                </select>
              )}
            </div>
            {errors.username && touched.username && (
              <ErrorTxt text={errors.username} />
            )}
          </div>
          {!enableEdit ? (
            <div>Some Random User</div>
          ) : (
            <InputField
              name="tag"
              variety="sidebar"
              placeholder="Your Tagline"
              type="text"
              getFieldProps={getFieldProps}
              errors={errors}
              touched={touched}
            />
          )}
          {!enableEdit ? (
            <div className="text-sm">
              You have not specified anything for your bio. Click on the edit
              button to add. Give a simple description about yourself in less
              than 150 characters.
            </div>
          ) : (
            <>
              <textarea
                rows={3}
                name="bio"
                placeholder="Enter Your Bio"
                {...getFieldProps("bio")}
                className="p-1 text-slate-800"
              />

              {errors.bio && touched.bio && <ErrorTxt text={errors.bio} />}
            </>
          )}
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-slate-800">
              Social Links
            </h3>
            {!enableEdit ? (
              <>
                <a>Website</a>
                <a>LinkedIn</a>
                <a>Twitter</a>
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="socialLinks.website"
                  placeholder="Website"
                  {...getFieldProps("socialLinks.website")}
                  className="p-1 text-slate-800"
                />

                {errors.socialLinks?.website &&
                  touched.socialLinks?.website && (
                    <ErrorTxt text={errors.socialLinks?.website} />
                  )}
                <input
                  type="text"
                  name="socialLinks.linkedIn"
                  placeholder="LinkedIn"
                  {...getFieldProps("socialLinks.linkedIn")}
                  className="p-1 text-slate-800"
                />
                {errors.socialLinks?.linkedIn &&
                  touched.socialLinks?.linkedIn && (
                    <ErrorTxt text={errors.socialLinks?.linkedIn} />
                  )}
                <input
                  type="text"
                  name="socialLinks.twitter"
                  placeholder="Twitter"
                  {...getFieldProps("socialLinks.twitter")}
                  className="p-1 text-slate-800"
                />
                {errors.socialLinks?.twitter &&
                  touched.socialLinks?.twitter && (
                    <ErrorTxt text={errors.socialLinks?.twitter} />
                  )}
              </>
            )}
          </div>
        </div>
        <main className="flex flex-col gap-8 px-10 py-4 bg-gray-600 size-full ">
          <div className="flex flex-col gap-3">
            <span className="text-3xl">YOUR PUBLIC PROFILE</span>
            <span className="text-md">Other users will see this.</span>
          </div>
          <div className="flex gap-10">
            <div className="flex flex-col flex-1 gap-5">
              <h1 className="font-semibold">Contact Info</h1>
              <div className="flex flex-col gap-2">
                <span>Your Current Phone No.</span>
                <TextDiv text="+91 0000000000" />
                {enableEdit && (
                  <ErrorTxt text="You can update your phone no in security tab" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <span>Your Current Email Address</span>
                <TextDiv text="shahinmhashim@gmail.com" />
                {enableEdit && (
                  <ErrorTxt text="Your primary email can't be changed" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <span>Address</span>
                <div className="flex w-full gap-3">
                  <div className="flex flex-col w-full">
                    {!enableEdit ? (
                      <TextDiv text="Your Current District" />
                    ) : (
                      <>
                        <input
                          type="text"
                          name="address.district"
                          disabled={!enableEdit}
                          placeholder="Your current district"
                          {...getFieldProps("address.district")}
                          className="p-2 text-black bg-blue-300 rounded-md text placeholder:text-gray-600"
                        />
                        {errors.address?.district &&
                          touched.address?.district && (
                            <ErrorTxt text={errors.address?.district} />
                          )}
                      </>
                    )}
                  </div>
                  <div className="flex flex-col w-full">
                    {!enableEdit ? (
                      <TextDiv text="Your Current State" />
                    ) : (
                      <>
                        <input
                          type="text"
                          name="address.state"
                          disabled={!enableEdit}
                          placeholder="Your current state"
                          {...getFieldProps("address.state")}
                          className="p-2 text-black bg-blue-300 rounded-md text placeholder:text-gray-600"
                        />
                        {errors.address?.state && touched.address?.state && (
                          <ErrorTxt text={errors.address?.state} />
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex flex-col w-full">
                    {!enableEdit ? (
                      <TextDiv text="Your Current Country" />
                    ) : (
                      <>
                        <input
                          type="text"
                          name="address.country"
                          disabled={!enableEdit}
                          placeholder="Your current country"
                          {...getFieldProps("address.country")}
                          className="p-2 text-black bg-blue-300 rounded-md text placeholder:text-gray-600"
                        />
                        {errors.address?.country &&
                          touched.address?.country && (
                            <ErrorTxt text={errors.address?.country} />
                          )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-5">
              <h1 className="font-semibold">Professional Info</h1>
              <div className="flex flex-col gap-2">
                <span>Occupation</span>
                {!enableEdit ? (
                  <TextDiv text="Your Current Occupation" />
                ) : (
                  <InputField
                    name="occupation"
                    variety="main"
                    placeholder="Your current occupation"
                    type="text"
                    getFieldProps={getFieldProps}
                    errors={errors}
                    touched={touched}
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <span>Company/Organization</span>
                {!enableEdit ? (
                  <TextDiv text="Your Current Organization" />
                ) : (
                  <InputField
                    name="organization"
                    variety="main"
                    placeholder="Your current organization"
                    type="text"
                    getFieldProps={getFieldProps}
                    errors={errors}
                    touched={touched}
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                {enableEdit ? "Done Editing ?" : "Edit Your Profile"}

                {!enableEdit ? (
                  <button
                    type="button"
                    onClick={() => setEnableEdit(true)}
                    className="w-full p-2 text-white bg-blue-500 rounded-sm hover:bg-blue-600"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="submit"
                      value={enableEdit ? "Save Changes" : "Edit Profile"}
                      className="w-full p-2 bg-green-600 rounded-sm hover:bg-green-500"
                      onClick={() => {
                        handleSubmit();
                      }}
                    />
                    <input
                      type="reset"
                      value="Reset Form"
                      onClick={() => resetForm()}
                      className="w-full p-2 text-white bg-blue-500 rounded-sm hover:bg-blue-600"
                    />
                    <input
                      type="button"
                      value="Cancel"
                      onClick={() => {
                        resetForm();
                        setEnableEdit(false);
                      }}
                      className="w-full p-2 text-white bg-red-500 rounded-sm hover:bg-red-600"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-lg font-semibold">Delete Account</h1>
              <span className="text-xs">
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
      </form>
    </>
  );
}
