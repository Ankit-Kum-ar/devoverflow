import { JobFilterParams } from "@/types/action";
import { Country } from "@/types/global";

export const fetchLocation = async () => {
  try {
    const response = await fetch("http://ip-api.com/json/?fields=countryCode");

    if (!response.ok) {
      throw new Error(`Location API error: ${response.status}`);
    }

    const location = await response.json();

    return location.countryCode?.toLowerCase();
  } catch (error) {
    console.error("fetchLocation error:", error);
    return "us";
  }
};

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await fetch(
      "https://api.restcountries.com/countries/v5?limit=100&response_fields=names.common,codes.alpha_2",
      {
        headers: {
          Authorization: `Bearer ${process.env.REST_COUNTRIES_API_KEY}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(`Countries API error ${response.status}: ${errorText}`);
    }

    const result = await response.json();

    const countries = result.data?.objects ?? [];

    return countries;
  } catch (error) {
    console.error("fetchCountries error:", error);
    return [];
  }
};

export const fetchJobs = async (filters: JobFilterParams) => {
  try {
    const { query, page = 1 } = filters;

    const country = await fetchLocation();

    const params = new URLSearchParams({
      query: query || "developer jobs",
      num_pages: String(page),
      country: country || "us",
      date_posted: "all",
    });

    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search-v2?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPID_API_KEY ?? "",
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`JSearch API error ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result.data?.jobs ?? [];
  } catch (error) {
    console.error("fetchJobs error:", error);
    return [];
  }
};
