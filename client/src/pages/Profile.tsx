import { useQuery } from "@apollo/client";
import React from "react";
import { graphql } from "../gql";

const profile_Task = graphql("query Query {\n  hello\n}");
export const Profile = () => {
  const { data, error, loading } = useQuery(profile_Task, {
    fetchPolicy: "no-cache",
  });
  if (loading) {
    return <div>Loading....</div>;
  }
  if (error) {
    return (
      <div className="flex flex-row justify-center items-center px-3 text-center">
        <h3 className="text-red-500 text-2xl">
          Error: {JSON.stringify(error)}
        </h3>
      </div>
    );
  }
  return (
    <React.Fragment>
      {data && (
        <div>
          <h2 className="font-thin text-2xl">{data.hello}</h2>
        </div>
      )}
    </React.Fragment>
  );
};
