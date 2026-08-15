import Image from "next/image";
import Link from "next/link";

import { processJobTitle } from "@/lib/utils";
import { Job } from "@/types/global";

interface JobLocationProps {
  job_country?: string;
  job_city?: string;
  job_state?: string;
}

const JobLocation = ({
  job_country,
  job_city,
  job_state,
}: JobLocationProps) => {
  const countryName = job_country
    ? (new Intl.DisplayNames(["en"], {
        type: "region",
      }).of(job_country) ?? job_country)
    : "";

  return (
    <div className="background-light800_dark400 flex max-w-full items-center gap-2 rounded-2xl px-3 py-1.5">
      {job_country && (
        <Image
          src={`https://flagsapi.com/${job_country}/flat/64.png`}
          alt={`${countryName} flag`}
          width={16}
          height={16}
          className="size-4 shrink-0 rounded-full"
        />
      )}

      <p className="truncate text-sm font-medium text-gray-700 dark:text-gray-200">
        {job_city && `${job_city}, `}
        {job_state && `${job_state}, `}
        {countryName}
      </p>
    </div>
  );
};

const JobCard = ({ job }: { job: Job }) => {
  const {
    employer_logo,
    employer_website,
    job_employment_type,
    job_title,
    job_description,
    job_apply_link,
    job_city,
    job_state,
    job_country,
  } = job;

  return (
    <section className="background-light900_dark200 light-border shadow-light100_darknone flex flex-col items-start gap-6 rounded-lg border p-6 sm:flex-row sm:p-8">
      {/* Mobile Location */}
      <div className="flex w-full justify-end sm:hidden">
        <JobLocation
          job_country={job_country}
          job_city={job_city}
          job_state={job_state}
        />
      </div>

      {/* Company Logo */}
      <div className="flex items-center gap-6">
        {employer_logo ? (
          <Link
            href={employer_website ?? "/jobs"}
            className="background-light800_dark400 relative size-16 rounded-xl"
          >
            <Image
              src={employer_logo}
              alt="company logo"
              fill
              className="size-full object-contain p-2"
            />
          </Link>
        ) : (
          <Image
            src="/images/site-logo.svg"
            alt="default site logo"
            width={64}
            height={64}
            className="rounded-[10px]"
          />
        )}
      </div>

      {/* Job Information */}
      <div className="w-full min-w-0">
        <div className="flex-between flex-wrap gap-2">
          <p className="base-semibold text-dark200_light900">
            {processJobTitle(job_title)}
          </p>

          {/* Desktop Location */}
          <div className="hidden sm:flex">
            <JobLocation
              job_country={job_country}
              job_city={job_city}
              job_state={job_state}
            />
          </div>
        </div>

        {/* Description */}
        <p className="body-regular text-dark500_light700 mt-2 line-clamp-2">
          {job_description?.slice(0, 200)}
        </p>

        {/* Bottom Information */}
        <div className="flex-between mt-8 flex-wrap gap-6">
          <div className="flex flex-wrap items-center gap-6">
            {/* Employment Type */}
            <div className="flex items-center gap-2">
              <Image
                src="/icons/clock-2.svg"
                alt="clock"
                width={20}
                height={20}
              />

              <p className="body-medium text-light-500">
                {job_employment_type}
              </p>
            </div>

            {/* Salary */}
            <div className="flex items-center gap-2">
              <Image
                src="/icons/currency-dollar-circle.svg"
                alt="dollar symbol"
                width={20}
                height={20}
              />

              <p className="body-medium text-light-500">Not disclosed</p>
            </div>
          </div>

          {/* Apply Link */}
          <Link
            href={job_apply_link ?? "/jobs"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <p className="body-semibold primary-text-gradient">View job</p>

            <Image
              src="/icons/arrow-up-right.svg"
              alt="arrow up right"
              width={20}
              height={20}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JobCard;
