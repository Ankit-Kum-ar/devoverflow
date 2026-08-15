import JobCard from "@/components/cards/JobCard";
import JobsFilter from "@/components/filters/JobFilter";
import Pagination from "@/components/Pagination";
import {
  fetchCountries,
  fetchJobs,
  fetchLocation,
} from "@/lib/actions/job.action";
import { RouteParams, Job } from "@/types/global";

const Page = async ({ searchParams }: RouteParams) => {
  const { query, location, page } = await searchParams;

  // Get user's country
  const userLocation = await fetchLocation();

  // Build the search query correctly
  const searchQuery =
    query || location
      ? `${query ?? ""} ${location ?? ""}`.trim()
      : `Software Engineer in ${userLocation}`;

  // Fetch jobs
  const jobs = await fetchJobs({
    query: searchQuery,
    page: page ?? 1,
  });

  // Fetch countries for the filter
  const countries = await fetchCountries();

  // Convert page to number
  const parsedPage = parseInt(page ?? "1", 10);

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>

      <div className="flex">
        <JobsFilter countriesList={countries} />
      </div>

      <section className="light-border mb-9 mt-11 flex flex-col gap-9 border-b pb-9">
        {jobs && jobs.length > 0 ? (
          jobs
            .filter((job: Job) => job.job_title)
            .map((job: Job) => <JobCard key={job.job_id} job={job} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800 w-full text-center">
            Oops! We couldn&apos;t find any jobs at the moment. Please try again
            later.
          </div>
        )}
      </section>

      {jobs && jobs.length > 0 && (
        <Pagination page={parsedPage} isNext={jobs.length === 10} />
      )}
    </>
  );
};

export default Page;
