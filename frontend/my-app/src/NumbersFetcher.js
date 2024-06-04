import React, { useState, useEffect } from "react";
import axios from "axios";

const NumbersFetcher = ({ type }) => {
  const [numbers, setNumbers] = useState([]);
  const [windowPrevState, setWindowPrevState] = useState([]);
  const [windowCurrState, setWindowCurrState] = useState([]);
  const [avg, setAvg] = useState(0);

  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9876/numbers/${type}`
        );
        const { windowPrevState, windowCurrState, numbers, avg } =
          response.data;
        setWindowPrevState(windowPrevState);
        setWindowCurrState(windowCurrState);
        setNumbers(numbers);
        setAvg(avg);
      } catch (error) {
        console.error("Error fetching numbers:", error);
      }
    };

    fetchNumbers();
  }, [type]);

  return (
    <div>
      <h2>Type: {type.toUpperCase()}</h2>
      <p>Previous State: {windowPrevState.join(", ")}</p>
      <p>Current State: {windowCurrState.join(", ")}</p>
      <p>Numbers: {numbers.join(", ")}</p>
      <p>Average: {avg}</p>
    </div>
  );
};

export default NumbersFetcher;
