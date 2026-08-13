import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";

import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { signInWithOAuthSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";

export async function POST(request: Request) {
  const { provider, providerAccountId, user } = await request.json();

  await dbConnect();

  const session = await mongoose.startSession(); // Start a new session for transaction
  session.startTransaction(); // Start the transaction

  try {
    const validatedData = await signInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    // Here you would typically check if the user already exists in your database
    const { name, username, email, image } = validatedData.data.user;

    // Slugify the username to ensure it is URL-friendly and does not contain spaces or special characters, this is important because usernames are often used in URLs and should be in a format that is easy to read and does not cause issues with URL encoding
    const slugifyUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    // If the user does not exist, create a new user record in the database
    let existingUser = await User.findOne({ email }).session(session); // Use the session for the query to ensure it is part of the transaction
    if (!existingUser) {
      // Create the user, we keep this [ existingUser ] to be able to use it later if needed, for example to return the user data in the response
      [existingUser] = await User.create(
        [{ name, username: slugifyUsername, email, image }],
        {
          session,
        }
      );
    } else {
      // If the user already exists, we can update their name and image if they have changed, but we should not update the email as it is used to identify the user and should not change without a proper process (like email verification) to prevent issues with account linking and security
      const updatedData: { name?: string; image?: string } = {};
      if (name && name !== existingUser.name) {
        updatedData.name = name;
      }
      if (image && image !== existingUser.image) {
        updatedData.image = image;
      }

      // Only update the user if there are changes to be made
      if (Object.keys(updatedData).length > 0) {
        // Update the user with the new data, we use [ findByIdAndUpdate ] to ensure that we get the updated user document back, and we use the session for the update query to ensure it is part of the transaction
        existingUser = await User.findByIdAndUpdate(existingUser._id, {
          $set: updatedData,
        }).session(session); // Use the session for the update query to ensure it is part of the transaction
      }
    }

    // Find the Account of the user with the provider and providerAccountId, if it does not exist, create it
    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session); // Use the session for the query to ensure it is part of the transaction
    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser._id,
            name,
            image,
            provider,
            providerAccountId,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction(); // Commit the transaction if everything is successful

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    session.abortTransaction(); // Abort the transaction in case of error
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    session.endSession(); // End the session after transaction is complete
  }
}
