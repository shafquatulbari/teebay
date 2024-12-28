import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <h1>Welcome to the Marketplace App</h1>
      </div>
    </ApolloProvider>
  );
}

export default App;
