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
    .max(20, "Username must be less than 20 characters"),

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
    .max(20, "Username must be less than 20 characters"),
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

export const AccountSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  name: z.string().min(1, "Name is required"),
  image: z.string().url("Please provide a valid URL for the image").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .optional(),
  provider: z.string().min(1, "Provider is required"),
  providerAccountId: z.string().min(1, "Provider Account ID is required"),
});

export const signInWithOAuthSchema = z.object({
  provider: z.string().min(1, "Provider is required"),
  providerAccountId: z.string().min(1, "Provider Account ID is required"),
  user: z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Please provide a valid email address"),
    image: z
      .string()
      .url("Please provide a valid URL for the image")
      .optional(),
  }),
});

export const EditQuestionSchema = AskQuestionSchema.extend({
  questionId: z.string().min(1, "Question ID is required"),
});

export const GetQuestionSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
});

export const PaginatedSearchSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

export const GetTagQuestionSchema = PaginatedSearchSchema.extend({
  tagId: z.string().min(1, "Tag ID is required"),
});

export const IncrementViewsSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
});

export const AnswerSchema = z.object({
  content: z.string().min(100, "Answer has to have more than 100 characters"),
});

export const AnswerServerSchema = AnswerSchema.extend({
  questionId: z.string().min(1, "Question ID is required"),
});

export const GetAnswerSchema = PaginatedSearchSchema.extend({
  questionId: z.string().min(1, "Question ID is required"),
});

export const AIAnswerSchema = z.object({
  question: z.string().min(5, "Question is required"),
  content: z
    .string()
    .min(100, "Content is required and should be at least 100 characters long"),
  userAnswer: z.string().optional(),
});

export const CreateVoteSchema = z.object({
  targetId: z.string().min(1, "Target ID is required"),
  targetType: z.enum(
    ["question", "answer"],
    "Target type must be either 'question' or 'answer'"
  ),
  voteType: z.enum(
    ["upvote", "downvote"],
    "Vote type must be either 'upvote' or 'downvote'"
  ),
});

export const UpdateVoteCountSchema = CreateVoteSchema.extend({
  change: z
    .number()
    .min(-1, "Change must be either 1 or -1")
    .max(1, "Change must be either 1 or -1"),
});

export const HasVotedSchema = CreateVoteSchema.pick({
  targetId: true,
  targetType: true,
});

export const CollectionBaseSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
});

export const GetUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const GetUserQuestionsSchema = PaginatedSearchSchema.extend({
  userId: z.string().min(1, "User Id is required"),
});

export const GetUsersAnswersSchema = PaginatedSearchSchema.extend({
  userId: z.string().min(1, "User Id is required"),
});
