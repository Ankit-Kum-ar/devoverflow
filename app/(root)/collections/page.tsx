import { CollectionsFilter } from "@/app/constants/filters";
import ROUTES from "@/app/constants/route";
import { EMPTY_QUESTION } from "@/app/constants/states";
import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import CommonFilter from "@/components/filters/CommonFilter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { getSavedQuestions } from "@/lib/actions/collection.action";

// This interface defines the expected structure of the search parameters that will be passed to the Home component. The searchParams property is a Promise that resolves to an object containing key-value pairs, where each key is a string representing the name of a query parameter and each value is a string representing the corresponding value of that parameter. This allows the Home component to access and utilize the search parameters from the URL for functionalities such as filtering or searching questions based on user input.
interface SearchParams {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}

async function Collections({ searchParams }: SearchParams) {
  const { page, pageSize, query, filter } = await searchParams; // Await the resolution of the searchParams promise to access the pagination and filtering parameters from the URL. This allows the Home component to utilize these parameters for functionalities such as paginating the list of questions or applying specific filters based on user input.

  const { success, data, error } = await getSavedQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { collection, isNext } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Saved Questions</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
          route={ROUTES.COLLECTION}
        />

        <CommonFilter
          filters={CollectionsFilter}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <DataRenderer
        success={success}
        error={error}
        data={collection}
        empty={EMPTY_QUESTION}
        render={(collection) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {collection.map((item) => (
              <QuestionCard
                key={item._id}
                question={item.question}
                showActionBtns
              />
            ))}
          </div>
        )}
      />
      <Pagination page={page} isNext={isNext || false} />
    </>
  );
}

export default Collections;
