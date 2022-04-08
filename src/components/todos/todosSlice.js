import { createSelector } from "reselect";
import { StatusFilters } from "../filters/filtersSlice";
import { client } from "../../api/client";

const initialState = {
  status: "idle",
  todos: [],
};

// function nextTodoId(todos) {
//   const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1);
//   return maxId + 1;
// }
export const selectTodos = (state) => state.todos.todos;

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
  return selectTodos(state).find((todo) => todo.id === todoId);
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
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };
    }
    case "todos/todoToggled": {
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id !== action.payload) {
            return todo;
          }
          return {
            ...todo,
            completed: !todo.completed,
          };
        }),
      };
    }
    case "todos/colorSelected": {
      const { todoId, color } = action.payload;
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id !== todoId) {
            return todo;
          }
          return {
            ...todo,
            color,
          };
        }),
      };
    }
    case "todos/todoDeleted": {
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };
    }
    case "todos/allCompleted": {
      return {
        ...state,
        todos: state.todos.map((todo) => ({ ...todo, completed: true })),
      };
    }
    case "todos/completedCleared": {
      return {
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
      };
    }
    case "todos/todosLoaded": {
      return {
        ...state,
        status: "idle",
        todos: action.payload,
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
