"use server";

import { ActionResponse, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import { SignInSchema, SignUpSchema } from "../validations";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import User from "@/database/user.model";
import bcrypt from "bcryptjs";
import Account from "@/database/account.model";
import { signIn } from "@/auth";
import { NotFoundError } from "../http-errors";

export async function signUpWithCredentials(
  params: AuthCredentials
): Promise<ActionResponse> {
  // 1. Validate the data of params.
  const validationResult = await action({
    params,
    schema: SignUpSchema,
  });

  // 2. If the validation fails, we return the validation error to the client.
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // 3. Extract the validated params from the validation result.
  const { name, email, username, password } = validationResult.params!;

  // 4. Start the session of mongoose, this is required to perform any database operations.
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 5. Start checks user already exists by email or not.
    const exisitingUser = await User.findOne({ email }).session(session);
    if (exisitingUser) {
      throw new Error("User already exists");
    }

    // 6. Checks user already exists by username or not.
    const existingUsername = await User.findOne({ username }).session(session);
    if (existingUsername) {
      throw new Error("Username already exists");
    }

    // 7. If the user doesn't exist, we create a new user in the database.
    // 8. First hashed the password using bcrypt, then we create a new user in the database using the User model and the session we started earlier, this will ensure that if there is any error during the user creation process, we can rollback the transaction to maintain the integrity of the database.
    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await User.create(
      [
        {
          name,
          email,
          username,
        },
      ],
      { session }
    );

    // 9. After creating User successfully, we need to create an account for the user.
    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    // 11 If everything is successful, we commit the transaction to save the changes to the database.
    await session.commitTransaction();

    // 10. Call signIn from auth.ts to create a session for the user, this will allow the user to be signed in immediately after signing up.
    await signIn("credentials", {
      email,
      password,
      redirect: false, // We set redirect to false because we don't want to redirect the user after signing in, we just want to create a session for the user.
    });


    // 12. Finally, we return a success response to the client.
    return {
      success: true,
    };
  } catch (error) {
    await session.abortTransaction(); // If there is any error, we abort the transaction to rollback any changes made to the database.
    return handleError(error) as ErrorResponse; // We return the error to the client.
  } finally {
    await session.endSession(); // Finally, we end the session.
  }
}

export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">
): Promise<ActionResponse> {
  // 1. Validate the data of params.
  const validationResult = await action({
    params,
    schema: SignInSchema,
  });

  // 2. If the validation fails, we return the validation error to the client.
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  // 3. Extract the validated params from the validation result.
  const { email, password } = validationResult.params!;

  try {
    // 5. Start checks user already exists by email or not.
    const exisitingUser = await User.findOne({ email });
    if (!exisitingUser) {
      throw new NotFoundError("User");
    }

    // 6. If the user exists, we need to check if the password is correct or not, we can do this by comparing the hashed password stored in the database with the password provided by the user using bcrypt.
    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    });

    if (!existingAccount) {
      throw new NotFoundError("Account");
    }

    // 7. If the account exists, we compare the hashed password with the provided password.
    const isPasswordValid = await bcrypt.compare(
      password,
      existingAccount.password
    );
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // 10. Call signIn from auth.ts to create a session for the user, this will allow the user to be signed in immediately after signing up.
    await signIn("credentials", {
      email,
      password,
      redirect: false, // We set redirect to false because we don't want to redirect the user after signing in, we just want to create a session for the user.
    });


    // 12. Finally, we return a success response to the client.
    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse; // We return the error to the client.
  }
}