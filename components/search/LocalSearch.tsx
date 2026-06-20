"use client";
import Image from "next/image";
import { Input } from "../ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formUrlQuery, removeKeyFromQuery } from "@/lib/url";

interface props {
  route: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
  iconPosition?: "left" | "right";
}

const LocalSearch = ({
  route,
  imgSrc,
  placeholder,
  otherClasses,
  iconPosition = "left",
}: props) => {
  const pathname = usePathname(); // Get the current pathname of the URL. e.g. "/search"
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || ""; // Get the current search query from the URL

  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        // Update the URL with the new search query without refreshing the page
        const newUrl = formUrlQuery({
          params: searchParams.toString(), // The searchParams.toString() method converts the URLSearchParams object into a query string format. e.g. "query=Really+hard&page=2"
          key: "query",
          value: searchQuery,
        });

        // Use the router.push method to navigate to the new URL with the updated search query. This will update the URL in the browser's address bar without causing a full page reload, allowing for a smoother user experience when performing searches.
        router.push(newUrl, { scroll: false }); // The scroll: false option prevents the page from scrolling to the top when the URL is updated, which can be useful for maintaining the user's position on the page while they are typing their search query.
      } else {
        // If the search query is empty, remove the "query" parameter from the URL
        // Check if the current pathname matches the specified route before removing the "query" parameter. This ensures that the URL is only updated when the user is on the relevant page, preventing unintended URL changes when the search query is cleared on other pages.
        if (pathname === route) {
          const newUrl = removeKeyFromQuery({
            params: searchParams.toString(),
            keysToRemove: ["query"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn); // Clear the timeout if the component unmounts or if the searchQuery changes before the timeout completes. This prevents multiple rapid updates to the URL as the user types, improving performance and reducing unnecessary URL changes.
  }, [searchQuery, router, route, searchParams]);
  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          width={24}
          height={24}
          alt="Search Icon"
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
      />
      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          width={24}
          height={24}
          alt="Search Icon"
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearch;
