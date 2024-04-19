import { useFormik } from "formik";
import { capitalizeFirstLetter } from "@/helpers/stringHandler";
import { cn } from "@/lib/utils";

/* eslint-disable react/prop-types */
const UpdateEntityDetailsForm = ({
  entity,
  initialData,
  setIsEditing,
  validationSchema,
  handleUpdateEntityDetails,
  setShowUpdateEntityDetailsForm,
}) => {
  const initialValues = {
    name: initialData?.name || "",
    description: initialData?.description || "",
  };

  const onSubmit = async (values) => handleUpdateEntityDetails(values);

  const { errors, handleSubmit, touched, getFieldProps, handleChange } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit,
    });

  return (
    <form onSubmit={handleSubmit}>
      <div className={cn(errors.name && touched.name ? "" : "mb-8")}>
        <label htmlFor="prName" className="block mb-4 text-sm font-medium">
          {capitalizeFirstLetter(entity)} Name
        </label>
        <input
          type="text"
          id="prName"
          name="prName"
          value={initialData?.name}
          {...getFieldProps("name")}
          onChange={(e) => {
            handleChange(e);
            setIsEditing(true);
          }}
          placeholder={`Your ${capitalizeFirstLetter(entity)} name`}
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
        {errors.name && touched.name && (
          <div className="my-2 text-sm text-red-600 dark:text-red-400">
            {errors.name}
          </div>
        )}
      </div>
      <div className="mb-8">
        <label htmlFor="description" className="block mb-4 text-sm font-medium">
          {capitalizeFirstLetter(entity)} Description
        </label>
        <textarea
          type="text"
          id="description"
          name="description"
          value={initialData?.description}
          {...getFieldProps("description")}
          onChange={(e) => {
            handleChange(e);
            setIsEditing(true);
          }}
          placeholder={`Your ${capitalizeFirstLetter(entity)} description`}
          className="w-full px-3 py-2 h-[6.5rem] text-black border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
        {errors.description && touched.description && (
          <span className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.description}
          </span>
        )}
      </div>
      <button
        type="submit"
        className="flex w-full mb-4 items-center gap-2 justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-600"
      >
        Confirm changes
      </button>
      <button
        type="button"
        onClick={() => {
          setIsEditing(false);
          setShowUpdateEntityDetailsForm(false);
        }}
        className="flex w-full items-center gap-2 justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600"
      >
        Cancel
      </button>
    </form>
  );
};

export default UpdateEntityDetailsForm;
