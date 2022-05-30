import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setContext } from "@apollo/client/link/context";
import { offsetLimitPagination } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";

//*********defalut value is false*********//
export const isLoggedInVar = makeVar(false);
//****************************************//
export const tokenVar = makeVar("");
const TOKEN = "token";

export const logUserIn = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN, token);
    isLoggedInVar(true);
    tokenVar(token);
  } catch (error) {
    console.log(error);
  }
};

export const logUserOut = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN);
    client.clearStore();
    isLoggedInVar(false);
    tokenVar(null);
  } catch (error) {
    console.log(error);
  }
};

const httpLink = createHttpLink({
  uri: "https://purple-corners-cough-123-212-52-42.loca.lt/graphql",
});

const uploadHttpLink = createUploadLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      token: tokenVar(),
    },
  };
});

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log(`GraphQL Error`, graphQLErrors);
  }
  if (networkError) {
    console.log("Network Error", networkError);
  }
});

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        seeFeed: offsetLimitPagination(),
      },
    },
  },
});

//npx localtunnel --port 4000
export const client = new ApolloClient({
  link: authLink.concat(onErrorLink).concat(uploadHttpLink),
  cache,
});
