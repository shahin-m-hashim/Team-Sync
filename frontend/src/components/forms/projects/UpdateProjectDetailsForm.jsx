import { useFormik } from "formik";
import { projectValidationSchema as validationSchema } from "@/validations/entityValidations";

/* eslint-disable react/prop-types */
const UpdateProjectDetailsForm = ({
  initialData,
  setShowUpdateProjectDetailsForm,
}) => {
  const initialValues = {
    name: initialData?.name || "",
    description: initialData?.description || "",
  };

  const onSubmit = async (values) => {
    console.log(values);
    setShowUpdateProjectDetailsForm(false);
  };

  const { errors, handleSubmit, touched, getFieldProps } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8">
        <label htmlFor="prName" className="block mb-4 text-sm font-medium">
          Project Name
        </label>
        <input
          type="text"
          id="prName"
          name="prName"
          {...getFieldProps("name")}
          placeholder="Your project name"
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
        {errors.name && touched.name && (
          <span className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.name}
          </span>
        )}
      </div>
      <div className="mb-8">
        <label htmlFor="description" className="block mb-4 text-sm font-medium">
          Project Description
        </label>
        <textarea
          type="text"
          id="description"
          name="description"
          {...getFieldProps("description")}
          placeholder="Your project description"
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
        onClick={() => setShowUpdateProjectDetailsForm(false)}
        className="flex w-full items-center gap-2 justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600"
      >
        Cancel
      </button>
    </form>
  );
};

export default UpdateProjectDetailsForm;
