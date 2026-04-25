import { Button } from "@/components/ui/button";
import Link from "next/link";
import ROUTES from "../constants/route";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilter from "@/components/filters/HomeFilter";
import QuestionCard from "@/components/cards/QuestionCard";
import handleError from "@/lib/handlers/error";
import { api } from "@/lib/api";

const questions = [
  {
    _id: "1",
    title: "How to center a div in CSS?",
    description:
      "I am trying to center a div both horizontally and vertically using CSS. I have tried using flexbox and grid, but it doesn't seem to work. Can someone help me with this?",
    tags: [
      { _id: "1", name: "css" },
      { _id: "2", name: "html" },
      { _id: "3", name: "React JS" },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      image: "/images/avatar.png"
    },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date("2023-10-01T12:00:00Z"),
  },
  {
    _id: "2",
    title: "How to Left a div in CSS?",
    description:
      "I am trying to center a div both horizontally and vertically using CSS. I have tried using flexbox and grid, but it doesn't seem to work. Can someone help me with this?",
    tags: [
      { _id: "1", name: "css" },
      { _id: "2", name: "html" },
      { _id: "3", name: "Express JS" },
    ],
    author: {
      _id: "2",
      name: "John Dic",
      image: "/images/avatar.png"
    },
    upvotes: 10,
    answers: 5,
    views: 100,
    createdAt: new Date("2024-10-01T12:00:00Z"),
  },
];

const test = async () => {
  try {
    return await api.users.getAll();
  } catch (error) {
    return handleError(error);
  }
}

// This interface defines the expected structure of the search parameters that will be passed to the Home component. The searchParams property is a Promise that resolves to an object containing key-value pairs, where each key is a string representing the name of a query parameter and each value is a string representing the corresponding value of that parameter. This allows the Home component to access and utilize the search parameters from the URL for functionalities such as filtering or searching questions based on user input.
interface SearchParams {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}

async function Home({ searchParams }: SearchParams) {
  const users = await test();
  console.log("Users:", users);
  const { query = "" } = await searchParams; // Await the resolution of the searchParams promise to access the query parameters from the URL. This allows the Home component to utilize the query parameters for functionalities such as filtering or searching questions based on user input.

  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(query?.toLowerCase())
  );

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
      <div className="mt-10 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
}

export default Home;
