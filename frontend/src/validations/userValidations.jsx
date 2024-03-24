import * as Yup from "yup";

const userValidationSchema = Yup.object({
  profilePicture: Yup.mixed().test(
    "fileSize",
    "Profile picture size must be less than 2MB",
    (value) => {
      if (!value) return true; // No file uploaded, validation passed
      return value.size <= 2000000; // 2MB in bytes
    }
  ),
  fname: Yup.string()
    .min(3, "Full name must be at least 3 characters long")
    .max(50, "Full name cannot exceed 50 characters"),
  username: Yup.string()
    .matches(
      /^[a-z0-9_]+$/,
      "Username can only contain lowercase letters, numbers, and underscores"
    )
    .min(5, "Username must be at least 5 characters long")
    .max(20, "Username cannot exceed 20 characters")
    .required("Username is required"),
  pronoun: Yup.string(),
  tag: Yup.string().max(20, "Tag cannot exceed 20 characters"),
  bio: Yup.string().max(150, "Bio cannot exceed 150 characters"),
  address: Yup.object().shape({
    district: Yup.string().max(50, "District cannot exceed 50 characters"),
    state: Yup.string().max(50, "State cannot exceed 50 characters"),
    country: Yup.string().max(50, "Country cannot exceed 50 characters"),
  }),
  occupation: Yup.string().max(50, "Occupation cannot exceed 50 characters"),
  organization: Yup.string().max(
    50,
    "Organization cannot exceed 50 characters"
  ),
  socialLinks: Yup.object().shape({
    website: Yup.string()
      .url("Invalid URL")
      .max(255, "URL cannot exceed 255 characters"),
    linkedIn: Yup.string()
      .url("Invalid URL")
      .max(255, "URL cannot exceed 255 characters"),
    twitter: Yup.string()
      .url("Invalid URL")
      .max(255, "URL cannot exceed 255 characters"),
  }),
});

export { userValidationSchema };
