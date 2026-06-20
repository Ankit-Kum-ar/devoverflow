import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
  Tag as TagType,
} from "@/types/global";
import action from "../handlers/action";
import { PaginatedSearchSchema } from "../validations";
import handleError from "../handlers/error";
import { Filter } from "mongodb";
import { Tag } from "@/database";

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
