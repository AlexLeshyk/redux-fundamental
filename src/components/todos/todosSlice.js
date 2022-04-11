import { createSelector } from "reselect";
import { StatusFilters } from "../filters/filtersSlice";
import { client } from "../../api/client";
import { createSlice } from "@reduxjs/toolkit";

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

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    todoAdded(state, action) {
      const todo = action.payload;
      state.todos[todo.id] = todo;
    },
    todoToggled(state, action) {
      const todoId = action.payload;
      const todo = state.todos[todoId];
      todo.completed = !todo.completed;
    },
    todoDeleted(state, action) {
      delete state.todos[action.payload];
    },
    colorSelected: {
      reducer(state, action) {
        const { color, todoId } = action.payload;
        state.todos[todoId].color = color;
      },
      prepare(todoId, color) {
        return {
          payload: { todoId, color },
        };
      },
    },
    allCompleted(state) {
      Object.values(state.todos).forEach((todo) => {
        todo.completed = true;
      });
    },
    completedCleared(state) {
      Object.values(state.todos).forEach((todo) => {
        if (todo.completed) {
          delete state.todos[todo.id];
        }
      });
    },
    todosLoading(state) {
      state.status = "loading";
    },
    todosLoaded(state, action) {
      const newTodos = {};
      action.payload.forEach((todo) => {
        newTodos[todo.id] = todo;
      });
      state.todos = newTodos;
      state.status = "idle";
    },
  },
});

export const {
  todoAdded,
  todoToggled,
  todoDeleted,
  colorSelected,
  completedCleared,
  allCompleted,
  todosLoading,
  todosLoaded,
} = todosSlice.actions;

export default todosSlice.reducer;

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
