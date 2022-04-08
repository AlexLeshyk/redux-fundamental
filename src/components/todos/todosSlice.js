import { createSelector } from "reselect";
import { StatusFilters } from "../filters/filtersSlice";
import { client } from "../../api/client";

const initialState = {
  status: "idle",
  todos: {},
};

// function nextTodoId(todos) {
//   const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1);
//   return maxId + 1;
// }
const selectTodoEntities = (state) => state.todos.todos;
export const selectTodos = createSelector(selectTodoEntities, (todos) => Object.values(todos));

export const selectFilteredTodos = createSelector(
  // First input selector: all todos
  selectTodos,
  // Second input selector: all filter values
  (state) => state.filters,
  // Output selector: receives both values
  (todos, filters) => {
    const { status, colors } = filters;
    const showAllCompletions = status === StatusFilters.All;
    if (showAllCompletions && colors.length === 0) {
      return todos;
    }

    const completedStatus = status === StatusFilters.Completed;
    // Return either active or completed todos based on filter
    return todos.filter((todo) => {
      const statusMatches = showAllCompletions || todo.completed === completedStatus;
      const colorMatches = colors.length === 0 || colors.includes(todo.color);
      console.log(statusMatches, colorMatches);
      return statusMatches && colorMatches;
    });
  }
);

export const selectTodoById = (state, todoId) => {
  return selectTodoEntities(state)[todoId];
};

export const selectTodoIds = createSelector(
  (state) => state.todos,
  (todos) => todos.map((todo) => todo.id)
);

export const selectFilteredTodoIds = createSelector(selectFilteredTodos, (filteredTodos) =>
  filteredTodos.map((todo) => todo.id)
);

const todosReducer = (state = initialState, action) => {
  switch (action.type) {
    case "todos/todoAdded": {
      const todo = action.payload;
      return {
        ...state,
        todos: {
          ...state.todos,
          [todo.id]: todo,
        },
      };
    }
    case "todos/todoToggled": {
      const todoId = action.payload;
      const todo = state.todos[todoId];
      return {
        ...state,
        todos: {
          ...state.todos,
          [todoId]: {
            ...todo,
            completed: !todo.completed,
          },
        },
      };
    }
    case "todos/colorSelected": {
      const { todoId, color } = action.payload;
      const todo = state.todos[todoId];
      return {
        ...state,
        todos: {
          ...state.todos,
          [todoId]: {
            ...todo,
            color,
          },
        },
      };
    }
    case "todos/todoDeleted": {
      const newTodos = { ...state.todos };
      delete newTodos[action.payload];
      return {
        ...state,
        todos: newTodos,
      };
    }
    case "todos/allCompleted": {
      const newTodos = { ...state.todos };
      Object.values(newTodos).forEach((todo) => {
        newTodos[todo.id] = {
          ...todo,
          completed: true,
        };
      });
      return {
        ...state,
        todos: newTodos,
      };
    }
    case "todos/completedCleared": {
      const newTodos = { ...state.todos };
      Object.values(newTodos).forEach((todo) => {
        if (todo.completed) {
          delete newTodos[todo.id];
        }
      });
      return {
        ...state,
        todos: newTodos,
      };
    }
    case "todos/todosLoaded": {
      const newTodos = {};
      action.payload.forEach((todo) => {
        newTodos[todo.id] = todo;
      });
      return {
        ...state,
        status: "idle",
        todos: newTodos,
      };
    }
    case "todos/todosLoading": {
      return {
        ...state,
        status: "loading",
      };
    }
    default:
      return state;
  }
};

export const completedCleared = () => ({ type: "todos/completedCleared" });

export const allCompleted = () => ({ type: "todos/allCompleted" });

export const colorSelected = (todoId, color) => ({
  type: "todos/colorSelected",
  payload: { todoId, color },
});

export const todoToggled = (todoId) => ({ type: "todos/todoToggled", payload: todoId });

export const todoDeleted = (todoId) => ({ type: "todos/todoDeleted", payload: todoId });

export const todosLoaded = (todos) => {
  return {
    type: "todos/todosLoaded",
    payload: todos,
  };
};

export const todoAdded = (todo) => {
  return {
    type: "todos/todoAdded",
    payload: todo,
  };
};

export const todosLoading = () => ({ type: "todos/todosLoading" });

export function fetchTodos() {
  return async (dispatch, getState) => {
    dispatch(todosLoading());
    const response = await client.get("/fakeApi/todos");
    dispatch(todosLoaded(response.todos));
  };
}

export const saveNewTodo = (text) => {
  return async (dispatch, getState) => {
    const todo = { text };
    const response = await client.post("/fakeApi/todos", { todo });
    dispatch(todoAdded(response.todo));
  };
};

export default todosReducer;
