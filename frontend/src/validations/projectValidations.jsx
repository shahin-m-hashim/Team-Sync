import * as Yup from "yup";

const projectValidationSchema = Yup.object({
  name: Yup.string()
    .max(25, "Project name cannot exceed 25 characters")
    .required("Username is required"),
  description: Yup.string().max(
    150,
    "Project description cannot exceed 150 characters"
  ),
});

export { projectValidationSchema };
