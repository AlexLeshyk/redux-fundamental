import { useState } from "react";
import { useDispatch } from "react-redux";

const Header = () => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    const textTrim = e.target.value.trim();
    if (e.key === "Enter" && textTrim) {
      dispatch({ type: "todos/todoAdded", payload: textTrim });
      setText("");
    }
  };

  return (
    <header className="header">
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </header>
  );
};

export default Header;
