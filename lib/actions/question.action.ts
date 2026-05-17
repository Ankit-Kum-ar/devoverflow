"use server";

import {
  ActionResponse,
  ErrorResponse,
  Question as QuestionType,
} from "@/types/global";
import action from "../handlers/action";
import { AskQuestionSchema } from "../validations";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";

export async function createQuestion(
  params: CreateQuestionParams
): Promise<ActionResponse<QuestionType>> {
  const validatedData = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }

  const { title, content, tags } = validatedData.params!;
  const userId = validatedData?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Create Question Document
    const [question] = await Question.create(
      [{ title, content, author: userId }],
      { session }
    );
    if (!question) {
      throw new Error("Failed to create question");
    }

    // 2. Create Tag Documents and Link Them to the Question
    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionsDocuments = [];
    for (const tag of tags) {
      // Use findOneAndUpdate with upsert to avoid duplicates and increment question count atomically
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, "i") },
        },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { new: true, upsert: true, session }
      );

      // If the tag was newly created, it will be returned with the new _id. If it already existed, it will be returned with the existing _id and the questions count will be incremented.
      tagIds.push(existingTag._id);
      tagQuestionsDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    // 3. Link Tags to Question
    await TagQuestion.insertMany(tagQuestionsDocuments, { session });

    // 4. Update Question Document with Tag References
    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } },
      { session }
    );

    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error as Error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
