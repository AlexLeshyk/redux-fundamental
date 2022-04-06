import { useState } from "react";

const Counter = () => {
  const [counter, setCounter] = useState(0);

  const increment = () => {
    setCounter((prevCounter) => prevCounter + 1);
  };

  return (
    <div>
      Value: {counter} <button onClick={increment}>Increment</button>
    </div>
  );
};

export default Counter;
