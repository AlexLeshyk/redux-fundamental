import { shallowEqual, useSelector } from "react-redux";
import TodoListItem from "./todoListItem";
import { selectFilteredTodoIds } from "./todosSlice";

const TodoList = () => {
  const todos = useSelector(selectFilteredTodoIds);

  const renderedListItems = todos.map((todoId) => {
    return <TodoListItem key={todoId} id={todoId} />;
  });

  return <ul className="todo-list">{renderedListItems}</ul>;
};

export default TodoList;
