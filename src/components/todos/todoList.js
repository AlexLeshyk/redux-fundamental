import { shallowEqual, useSelector } from "react-redux";
import TodoListItem from "./todoListItem";
import { selectFilteredTodoIds } from "./todosSlice";

const TodoList = () => {
  const todos = useSelector(selectFilteredTodoIds);
  const loadingStatus = useSelector((state) => state.todos.status);

  if (loadingStatus === "loading") {
    return (
      <div className="todo-list">
        <div className="loader" />
      </div>
    );
  }

  const renderedListItems = todos.map((todoId) => {
    return <TodoListItem key={todoId} id={todoId} />;
  });

  return <ul className="todo-list">{renderedListItems}</ul>;
};

export default TodoList;
