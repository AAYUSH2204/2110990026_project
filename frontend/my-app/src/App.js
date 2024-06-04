import React from "react";
import NumbersFetcher from "./NumbersFetcher";

const App = () => {
  return (
    <div>
      <h1>Number Fetcher</h1>
      <NumbersFetcher type="p" /> {/* Fetch prime numbers */}
      <NumbersFetcher type="f" /> {/* Fetch Fibonacci numbers */}
      <NumbersFetcher type="e" /> {/* Fetch even numbers */}
      <NumbersFetcher type="r" /> {/* Fetch random numbers */}
    </div>
  );
};

export default App;
