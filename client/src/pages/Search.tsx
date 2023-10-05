import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useDebounce } from "../hooks/useDebounce";
import { graphql } from "../gql/index";
interface UserType {
  __typename?: "User";
  username: string;
  id: string;
}
const SEARCH_TASK = graphql(
  "query Search($pharse: String!) {\n  search(pharse: $pharse) {\n    ... on User {\n      id\n      username\n    }\n  }\n}"
);

const Search: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchResult, setSearchResult] = useState<UserType[]>([]);
  const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleChangeSearchValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const searchValue = event.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchValue(searchValue);
    }
  };
  const debounceValue = useDebounce(searchValue, 500);
  const { data, loading, error } = useQuery(SEARCH_TASK, {
    variables: {
      pharse: debounceValue,
    },
  });
  useEffect(() => {
    if (data?.search) {
      setSearchResult(data.search);
    }
  }, [data?.search]);
  useEffect(() => {
    if (searchResult.length > 0) {
      setIsOpenSearch(true);
    } else {
      setIsOpenSearch(false);
    }
  }, [searchResult]);
  const handleClear = () => {
    setSearchValue("");
    setSearchResult([]);
    if (inputRef.current != null) {
      inputRef.current.focus();
    }
  };
  if (loading) {
    return <h1 className="text-2xl">Searching...</h1>;
  }
  if (error) {
    return <h1 className="text-2xl text-red-500">Error...</h1>;
  }
  return (
    <React.Fragment>
      <div className="flex flex-row justify-center items-center">
        <h1 className="text-2xl">Search User</h1>
      </div>
      <div className="relative">
        <input
          ref={inputRef}
          style={{ width: "300px" }}
          type="search"
          placeholder="Please input value search"
          value={searchValue}
          onChange={handleChangeSearchValue}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  p-2 mr-3 mt-5"
        ></input>

        {!!searchValue && (
          <button
            onClick={handleClear}
            className="absolute top-[63%] translate-y-[-50%] text-gray-600 right-[30px]"
          >
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        )}
      </div>

      <div className="mt-3">
        <ul>
          {isOpenSearch &&
            searchResult.map((searchValue, index) => {
              return (
                <React.Fragment key={index}>
                  <li className="list-disc ml-4">
                    User: {searchValue.username}
                  </li>
                </React.Fragment>
              );
            })}
        </ul>
      </div>
    </React.Fragment>
  );
};

export default Search;
