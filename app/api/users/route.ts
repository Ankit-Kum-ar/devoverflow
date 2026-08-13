import { NextResponse } from "next/server";

import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find().select("-password").lean();
    return NextResponse.json(
      {
        success: true,
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate the request body here using your validation schema (not shown in this snippet)
    const validatedData = UserSchema.safeParse(body); // safeParse returns an object with success property indicating if validation passed or failed, and either data or error property depending on the result

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { email, username } = validatedData.data;

    // Check if a user with the same email or username already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("A user with this email already exists.");
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw new Error("A user with this username already exists.");
    }

    const newUser = await User.create(validatedData.data);
    return NextResponse.json(
      {
        success: true,
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
