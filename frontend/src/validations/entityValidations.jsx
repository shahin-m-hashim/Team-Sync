import * as Yup from "yup";

const entityValidationSchema = Yup.object({
  name: Yup.string()
    .max(25, "Name cannot exceed 25 characters")
    .required("Name is required"),
  description: Yup.string().max(
    150,
    "Description cannot exceed 150 characters"
  ),
});

const teamValidationSchema = entityValidationSchema;
const subTeamValidationSchema = entityValidationSchema;
const projectValidationSchema = entityValidationSchema;

export {
  teamValidationSchema,
  projectValidationSchema,
  subTeamValidationSchema,
};
