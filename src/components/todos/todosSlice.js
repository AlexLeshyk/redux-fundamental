import { client } from "../../api/client";

const initialState = [];

// function nextTodoId(todos) {
//   const maxId = todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1);
//   return maxId + 1;
// }

const todosReducer = (state = initialState, action) => {
  switch (action.type) {
    case "todos/todoAdded": {
      return [...state, action.payload];
    }
    case "todos/todoToggled": {
      return state.map((todo) => {
        if (todo.id !== action.payload) {
          return todo;
        }
        return {
          ...todo,
          completed: !todo.completed,
        };
      });
    }
    case "todos/colorSelected": {
      const { todoId, color } = action.payload;
      return state.map((todo) => {
        if (todo.id !== todoId) {
          return todo;
        }
        return {
          ...todo,
          color,
        };
      });
    }
    case "todos/todoDeleted": {
      return state.filter((todo) => todo.id !== action.payload);
    }
    case "todos/allCompleted": {
      return state.map((todo) => {
        return { ...todo, completed: true };
      });
    }
    case "todos/completedCleared": {
      return state.filter((todo) => !todo.completed);
    }
    case "todos/todosLoaded": {
      return action.payload;
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

export function fetchTodos() {
  return async (dispatch, getState) => {
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
