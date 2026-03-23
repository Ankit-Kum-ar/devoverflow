import qs from "query-string";

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

interface RemoveKeyFromQueryParams {
  params: string;
  keysToRemove: string[];
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const queryString = qs.parse(params); // It returns an object of key-value pairs from the query string. e.g. { query: "javascript", page: "2" }
  queryString[key] = value; // Update the value of the specified key in the queryString object. e.g. { query: "javascript", page: "3" }

  // Use the qs.stringifyUrl method to convert the updated queryString object back into a query string format and construct the new URL. The url property specifies the base URL (current pathname), and the query property contains the updated query parameters. e.g. "/search?query=javascript&page=3"
  return qs.stringifyUrl({
    url: window.location.pathname, // Get the current path of the URL. e.g. "/search"
    query: queryString, // Convert the updated queryString object back into a query string format. e.g. "query=javascript&page=3"
  });
};

export const removeKeyFromQuery = ({
  params,
  keysToRemove,
}: RemoveKeyFromQueryParams) => {
  const queryString = qs.parse(params);

  // Iterate over the keysToRemove array and delete each key from the queryString object. This effectively removes the specified keys from the query parameters, allowing for cleaner URLs when certain filters or search parameters are cleared.
  keysToRemove.forEach((key) => {
    delete queryString[key]; // Remove the specified key from the queryString object
  });
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryString,
    },
    { skipNull: true }
  ); // The skipNull option ensures that any keys with null or undefined values are not included in the resulting query string, which helps to keep the URL clean and free of unnecessary parameters.;
};
