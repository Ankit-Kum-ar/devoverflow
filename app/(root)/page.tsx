import { Button } from "@/components/ui/button";
import Link from "next/link";
import ROUTES from "../constants/route";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import QuestionCard from "@/components/cards/QuestionCard";
import { getQuestions } from "@/lib/actions/question.action";
import DataRenderer from "@/components/DataRenderer";
import { EMPTY_QUESTION } from "../constants/states";

// This interface defines the expected structure of the search parameters that will be passed to the Home component. The searchParams property is a Promise that resolves to an object containing key-value pairs, where each key is a string representing the name of a query parameter and each value is a string representing the corresponding value of that parameter. This allows the Home component to access and utilize the search parameters from the URL for functionalities such as filtering or searching questions based on user input.
interface SearchParams {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}

async function Home({ searchParams }: SearchParams) {
  const { page, pageSize, query, filter } = await searchParams; // Await the resolution of the searchParams promise to access the pagination and filtering parameters from the URL. This allows the Home component to utilize these parameters for functionalities such as paginating the list of questions or applying specific filters based on user input.

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { questions } = data || {};

  return (
    <>
      <section className="w-full flex flex-col-reverse sm:flex-row justify-between gap-4 sm:items-center">
        {" "}
        {/* flex-col-reverse -> display element from bottom to top */}
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTIONS}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          imgSrc="/icons/search.svg"
          placeholder="Search..."
          otherClasses="flex-1"
          route="/"
        />
      </section>
      <HomeFilter />
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
    </>
  );
}

export default Home;
