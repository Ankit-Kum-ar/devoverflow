import ROUTES from "@/app/constants/route";
import { EMPTY_QUESTION } from "@/app/constants/states";
import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import { getTagQuestions } from "@/lib/actions/tag.action";
import { getTechDescription, cn, getDeviconClassName } from "@/lib/utils";
import { RouteParams } from "@/types/global";
import { redirect } from "next/navigation";

const TagDetail = async ({ params, searchParams }: RouteParams) => {
  // Resolve dynamic params and search params
  const { id: tagId } = await params;
  const { page, pageSize, query } = await searchParams;

  // Call server action to fetch tag questions
  const { success, data, error } = await getTagQuestions({
    tagId,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
  });

  // Handle error case
  if (!success || !data) {
    return (
      <DataRenderer
        success={success}
        error={error}
        data={null}
        render={() => null}
      />
    );
  }

  const { tags: tag, questions, isNext } = data;

  if (!tag) {
    return redirect(ROUTES.TAGS);
  }

  // Get icon and description for the tag
  const iconClass = getDeviconClassName(tag.name);
  const description = getTechDescription(tag.name);

  return (
    <>
      {/* Tag Header Section */}
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-col gap-4">
          <h1 className="h1-bold text-dark100_light900">{tag.name}</h1>
          <p className="body-regular text-dark500_light700 max-w-2xl">
            {description}
          </p>
        </div>
        <div className="flex items-center justify-center rounded-md bg-light-800 p-8 dark:bg-dark-300">
          <i
            className={cn(iconClass, "text-5xl")}
            aria-label={`${tag.name} icon`}
          />
        </div>
      </section>

      {/* Search Section */}
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.TAG(tagId)}
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          iconPosition="left"
          otherClasses="flex-1"
        />
      </section>

      {/* Questions Section */}
      <div className="mt-8">
        <p className="body-semibold text-dark200_light900">
          {questions?.length || 0} Question{questions?.length !== 1 ? "s" : ""}
        </p>
      </div>

      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />

      {/* Pagination Section */}
      {isNext && (
        <section className="mt-10 flex justify-center">
          <a
            href={`${ROUTES.TAG(tagId)}?page=${Number(page || 1) + 1}&pageSize=${pageSize || 10}${query ? `&query=${query}` : ""}`}
            className="primary-gradient flex min-h-[46px] items-center justify-center rounded-lg px-8 py-3 text-light-900"
          >
            Load More
          </a>
        </section>
      )}
    </>
  );
};

export default TagDetail;
