import { useFormik } from "formik";
import { projectValidationSchema as validationSchema } from "@/validations/projectValidations";

/* eslint-disable react/prop-types */
const UpdateProjectDetailsForm = ({
  projectData,
  setShowUpdateProjectDetailsForm,
}) => {
  const initialValues = {
    name: projectData?.name || "",
    description: projectData?.description || "",
  };

  const onSubmit = async (values) => {
    try {
      console.log(values);
    } catch (err) {
      console.log(err);
    } finally {
      setShowUpdateProjectDetailsForm(false);
    }
  };

  const { errors, handleSubmit, touched, getFieldProps } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2 text-center text-sm text-red-600 dark:text-red-400">
        You can update these in collaboration section !!!
      </div>
      <div className="mb-8">
        <label htmlFor="prName" className="block mb-4 text-sm font-medium">
          Project Name
        </label>
        <input
          type="text"
          id="prName"
          name="prName"
          {...getFieldProps("name")}
          placeholder={"Your project name"}
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
          rows={2}
          name="description"
          {...getFieldProps("description")}
          placeholder={"Your project description"}
          className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
        {errors.description && touched.description && (
          <span className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.description}
          </span>
        )}
      </div>

      <div className="flex gap-2 mt-6">
        <button
          type="submit"
          className="flex w-full items-center gap-2 justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-600"
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
      </div>
    </form>
  );
};

export default UpdateProjectDetailsForm;
