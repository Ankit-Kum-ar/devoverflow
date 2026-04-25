import { ActionResponse } from "@/types/global";
import logger from "../logger";
import handleError from "./error";
import { RequestError } from "../http-errors";

// RequestInit is a built-in TypeScript type that represents the options for the fetch API
interface FetchOptions extends RequestInit {
  timeout?: number; // Optional timeout in milliseconds
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {}
): Promise<ActionResponse<T>> {
  const {
    timeout = 5000,
    headers: customHeaders = {},
    ...restOptions
  } = options; // Default timeout of 5 seconds
  const controller = new AbortController(); // AbortController is a built-in API that allows us to abort fetch requests
  const id = setTimeout(() => controller.abort(), timeout); // Set a timeout to abort the request if it takes too long

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const headers: HeadersInit = {
    ...defaultHeaders,
    ...customHeaders,
  };

  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal, // Attach the abort signal to the fetch request
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(id); // Clear the timeout if the request completes successfully

    if (!response.ok) {
      throw new RequestError(
        response.status,
        `Request failed with status ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (err) {
    const error = isError(err) ? err : new Error("An unknown error occurred");
    if (error.name === "AbortError") {
      logger.warn(`Fetch request to ${url} was aborted due to timeout.`);
    } else {
      logger.error(`Fetch request to ${url} failed: ${error.message}`);
    }

    return handleError(error) as ActionResponse<T>;
  }
}
