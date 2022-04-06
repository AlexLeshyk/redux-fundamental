import { shallowEqual, useSelector } from "react-redux";
import TodoListItem from "./todoListItem";

const selectTodoIds = (state) => state.todos.map((todo) => todo.id);

const TodoList = () => {
  const todos = useSelector(selectTodoIds, shallowEqual);

  const renderedListItems = todos.map((todoId) => {
    return <TodoListItem key={todoId} id={todoId} />;
  });

  return <ul className="todo-list">{renderedListItems}</ul>;
};

export default TodoList;
