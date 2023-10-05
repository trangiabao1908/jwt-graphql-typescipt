/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "mutation Login($loginInput: LoginInput!) {\n  login(loginInput: $loginInput) {\n    accessToken\n    code\n    message\n    success\n  }\n}": types.LoginDocument,
    "mutation Logout($userId: ID!) {\n  logout(userId: $userId) {\n    code\n    success\n  }\n}": types.LogoutDocument,
    "mutation Register($registerInput: RegisterInput!) {\n  register(registerInput: $registerInput) {\n    code\n    message\n    success\n    user {\n      id\n      username\n    }\n  }\n}": types.RegisterDocument,
    "query GetAllUser {\n  getAllUser {\n    id\n    username\n  }\n}": types.GetAllUserDocument,
    "query Query {\n  hello\n}": types.QueryDocument,
    "query Search($pharse: String!) {\n  search(pharse: $pharse) {\n    ... on User {\n      id\n      username\n    }\n  }\n}": types.SearchDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($loginInput: LoginInput!) {\n  login(loginInput: $loginInput) {\n    accessToken\n    code\n    message\n    success\n  }\n}"): (typeof documents)["mutation Login($loginInput: LoginInput!) {\n  login(loginInput: $loginInput) {\n    accessToken\n    code\n    message\n    success\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Logout($userId: ID!) {\n  logout(userId: $userId) {\n    code\n    success\n  }\n}"): (typeof documents)["mutation Logout($userId: ID!) {\n  logout(userId: $userId) {\n    code\n    success\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Register($registerInput: RegisterInput!) {\n  register(registerInput: $registerInput) {\n    code\n    message\n    success\n    user {\n      id\n      username\n    }\n  }\n}"): (typeof documents)["mutation Register($registerInput: RegisterInput!) {\n  register(registerInput: $registerInput) {\n    code\n    message\n    success\n    user {\n      id\n      username\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetAllUser {\n  getAllUser {\n    id\n    username\n  }\n}"): (typeof documents)["query GetAllUser {\n  getAllUser {\n    id\n    username\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Query {\n  hello\n}"): (typeof documents)["query Query {\n  hello\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query Search($pharse: String!) {\n  search(pharse: $pharse) {\n    ... on User {\n      id\n      username\n    }\n  }\n}"): (typeof documents)["query Search($pharse: String!) {\n  search(pharse: $pharse) {\n    ... on User {\n      id\n      username\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;