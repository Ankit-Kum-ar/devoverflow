import z from "zod";

export const SignInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z ]+$/, "Name can only contain letters and spaces"),

  email: z.string().min(1, "Email is required").email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(1, "Title is requried.")
    .max(100, "Title can't exceed 100 characters."),

  content: z.string().min(1, "Body is required."),

  tags: z
    .array(
      z
        .string()
        .min(1, "Tag is requried.")
        .max(30, "Title can't exceed 30 characters.")
    )
    .min(1, "At least one tag is required.")
    .max(3, "Can't add more than 3 tags."),
});

export const UserSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: z.string().email("Please provide a valid email address"),
  bio: z.string().optional(),
  image: z.string().url("Please provide a valid URL for the image").optional(),
  location: z.string().optional(),
  portfolio: z
    .string()
    .url("Please provide a valid URL for the portfolio")
    .optional(),
  reputation: z.number().int().nonnegative().optional(),
});
