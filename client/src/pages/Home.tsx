import { useQuery } from "@apollo/client";
import { Fragment } from "react";
import { graphql } from "../gql/index";
const getAllUser = graphql(
  "query GetAllUser {\n  getAllUser {\n    id\n    username\n  }\n}"
);
const Home = () => {
  const { data, loading } = useQuery(getAllUser, { fetchPolicy: "no-cache" });
  if (loading) {
    <div>loading....</div>;
  }
  return (
    <Fragment>
      <div className="">
        <h1 className="text-3xl">You can view list all user</h1>
        <ul className="mt-5 ml-5 text-left">
          {data?.getAllUser.map((user) => (
            <li key={user.id} className="text-md list-disc font-medium">
              User: {user.username}
            </li>
          ))}
        </ul>
      </div>
    </Fragment>
  );
};

export default Home;
