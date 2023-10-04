import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import AuthProvider from "./contexts/AuthProvider";
import "./index.css";
import { route } from "./router";
import authToken from "./utils/authToken";
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
  fetchOptions: {
    credentials: "include",
  },
});
const authLink = setContext((_, { headers }) => {
  const token = authToken.getToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <AuthProvider>
      <RouterProvider router={route}></RouterProvider>
    </AuthProvider>
  </ApolloProvider>
);
