"use server";

import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
  Question as QuestionType,
} from "@/types/global";
import action from "../handlers/action";
import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  IncrementViewsSchema,
  PaginatedSearchSchema,
} from "../validations";
import handleError from "../handlers/error";
import mongoose from "mongoose";
import type { Filter } from "mongodb";
import Question, { IQuestionDoc } from "@/database/question.model";
import Tag, { ITagDoc } from "@/database/tag.model";
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

export async function editQuestion(
  params: EditQuestionParams
): Promise<ActionResponse<IQuestionDoc>> {
  const validatedData = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }

  const { title, content, tags } = validatedData.params!;
  const userId = validatedData?.session?.user?.id;
  const questionId = validatedData.params!.questionId;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId).populate("tags");
    if (!question) {
      throw new Error("Question not found");
    }

    if (question.author.toString() !== userId) {
      throw new Error("Unauthorized");
    }

    // Update question details
    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }

    // Handle tags
    const tagsToAdd = tags.filter(
      (tag) =>
        !question.tags.some((t: ITagDoc) =>
          t.name.toLowerCase().includes(tag.toLowerCase())
        )
    );
    const tagsToRemove = question.tags.filter(
      (tag: ITagDoc) =>
        !tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
    );

    // Add new tags
    const newTagDocuments = [];
    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          {
            name: { $regex: `^${tag}$`, $options: "i" },
          },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { new: true, upsert: true, session }
        );
        if (existingTag) {
          newTagDocuments.push({
            tag: existingTag._id,
            question: questionId,
          });

          question.tags.push(existingTag._id);
        }
      }
    }

    // Remove old tags
    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id);
      await Tag.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { questions: -1 } },
        { session }
      );
      await TagQuestion.deleteMany(
        { tag: { $in: tagIdsToRemove }, question: questionId },
        { session }
      );
      question.tags = question.tags.filter(
        (tag: mongoose.Types.ObjectId) =>
          !tagIdsToRemove.some((id: mongoose.Types.ObjectId) =>
            id.equals(tag._id)
          )
      );
    }

    // Insert new tag-question relationships
    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, { session });
    }

    await question.save({ session });
    await session.commitTransaction();
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    session.abortTransaction();
    return handleError(error as Error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function getQuestion(
  params: GetQuestionParams
): Promise<ActionResponse<QuestionType>> {
  const validatedData = await action({
    params,
    schema: GetQuestionSchema,
    authorize: true,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const questionId = validatedData.params!.questionId;

  try {
    const question = await Question.findById(questionId)
      .populate("tags")
      .populate("author", "_id name image");
    if (!question) {
      throw new Error("Question not found");
    }
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}

export async function getQuestions(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ questions: QuestionType[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * pageSize; // this is the number of documents to skip based on the current page and page size
  const limit = Number(pageSize); // we fetch one extra document to check if there is a next page

  const filterQuery: Filter<typeof Question> = {}; // this will hold our dynamic query conditions

  if (filter === "recommended") {
    return {
      success: true,
      data: {
        questions: [], // we will implement this logic later
        isNext: false, // we will implement this logic later
      },
    };
  }

  // this if block adds a dynamic $or condition to the filterQuery if a search query is provided. It uses regular expressions to perform a case-insensitive search on both the title and content fields of the questions.
  if (query) {
    filterQuery.$or = [
      { title: { $regex: new RegExp(query, "i") } },
      { content: { $regex: new RegExp(query, "i") } },
    ];
  }

  let sortCriteria = {}; // this will hold our dynamic sorting criteria

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 }; // sort by creation date in descending order
      break;
    case "unanswered":
      filterQuery.answers = 0; // filter for questions that have no answers
      sortCriteria = { createdAt: -1 }; // sort by creation date in descending order
      break;
    case "popular":
      sortCriteria = { upvotes: -1 }; // sort by upvotes in descending order
      break;
    default:
      sortCriteria = { createdAt: -1 }; // default sorting by creation date in descending order
      break;
  }

  try {
    const totalQuestions = await Question.countDocuments(filterQuery); // get the total count of questions matching the filter
    const questions = await Question.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .populate("tags", "name") // populate tags with only the name field
      .lean() // use lean for better performance since we don't need Mongoose documents
      .populate("author", "name image"); // populate author with only name and image fields

    const isNext = totalQuestions > skip + questions.length; // determine if there is a next page based on the total count and the number of questions fetched

    return {
      success: true,
      data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}

export async function incrementViews(
  params: IncrementViewsParams
): Promise<ActionResponse<{ views: number }>> {
  const validationResult = await action({
    params,
    schema: IncrementViewsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      throw new Error("Question not Found");
    }

    question.views += 1;
    await question.save();

    return {
      success: true,
      data: { views: question.views },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
