import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
  Question as QuestionType,
  Tag as TagType,
} from "@/types/global";
import action from "../handlers/action";
import { GetTagQuestionSchema, PaginatedSearchSchema } from "../validations";
import handleError from "../handlers/error";
import { Filter } from "mongodb";
import { Question, Tag } from "@/database";
import dbConnect from "../mongoose";

export const getTags = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<{ tags: TagType[]; isNext: boolean }>> => {
  const validatedData = await action({
    params,
    schema: PaginatedSearchSchema,
  });

  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * pageSize; // this is the number of documents to skip based on the current page and page size
  const limit = Number(pageSize); // we fetch one extra document to check if there is a next page

  const filterQuery: Filter<typeof Tag> = {}; // this will hold our dynamic query conditions

  if (query) {
    filterQuery.$or = [{ name: { $regex: query, $options: "i" } }];
  }

  let sortCriteria = {};

  switch (filter) {
    case "popular":
      sortCriteria = { questions: -1 };
      break;
    case "recent":
      sortCriteria = { createdAt: 1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "name":
      sortCriteria = { name: 1 };
      break;
    default:
      sortCriteria = { questions: -1 };
  }

  try {
    const totalTags = await Tag.countDocuments(filterQuery);

    const tags = await Tag.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit + 1); // fetch one extra document to check if there is a next page

    const isNext = totalTags > skip + tags.length; // determine if there is a next page based on the total count and the number of documents fetched

    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
};

// Make a call to the 'Questions' model and find questions that contains this tag. (This will be used in the tag page to show questions related to that tag)
export const getTagQuestions = async (
  params: GetTagQuestionParams
): Promise<
  ActionResponse<{ tags: TagType; questions: QuestionType[]; isNext: boolean }>
> => {
  const validatedData = await action({
    params,
    schema: GetTagQuestionSchema,
  });

  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, tagId } = params;
  const skip = (Number(page) - 1) * pageSize; // this is the number of documents to skip based on the current page and page size
  const limit = Number(pageSize); // we fetch one extra document to check if there is a next page

  try {
    const tag = await Tag.findById(tagId);
    if (!tag) throw new Error("Tag not found");
    const filterQuery: Filter<typeof Question> = {
      tags: { $in: [tagId] },
    };

    if (query) {
      filterQuery.title = [{ $regex: query, $options: "i" }];
    }
    const totalQuestions = await Question.countDocuments(filterQuery);

    // select and populate only the necessary fields to optimize performance
    // select is used to specify which fields we want to retrieve from the database, and populate is used to replace the author and tags references with their actual data (name and image for author, name for tags)
    // populate is used to fetch the related data from the referenced collections (author and tags) and include it in the result, which allows us to display the author's name and image, as well as the tag names, without needing additional queries
    const questions = await Question.find(filterQuery)
      .select("_id title views answers upvotes downvotes createdAt author")
      .populate([
        { path: "author", select: "name image " },
        { path: "tags", select: "name" },
      ])
      .skip(skip)
      .limit(limit + 1); // fetch one extra document to check if there is a next page

    const isNext = totalQuestions > skip + questions.length; // determine if there is a next page based on the total count and the number of documents fetched

    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tag)),
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
};

export const getTopTags = async (): Promise<ActionResponse<TagType>> => {
  try {
    await dbConnect();
    const tags = await Tag.find().sort({ questions: -1 }).limit(5);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(tags)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
