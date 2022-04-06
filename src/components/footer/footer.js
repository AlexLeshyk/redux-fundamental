import { useSelector, useDispatch } from "react-redux";
import ColorFilters from "./colorFilters";
import RemainingTodos from "./remainingTodos";
import StatusFilter from "./statusFilter";

const Footer = () => {
  const { colors, status } = useSelector((state) => state.filters);
  const todosRemaining = useSelector((state) => {
    const uncompletedTodos = state.todos.filter((todo) => !todo.completed);
    return uncompletedTodos.length;
  });
  const dispatch = useDispatch();

  const onColorChange = (color, changeType) => {
    dispatch({ type: "filters/colorFilterChanged", payload: { changeType, color } });
  };
  const onStatusChange = (status) => {
    dispatch({ type: "filters/statusFilterChanged", payload: status });
  };

  const handleAllCompleted = () => {
    dispatch({ type: "todos/allCompleted" });
  };

  const handleClearCompleted = () => {
    dispatch({ type: "todos/completedCleared" });
  };

  return (
    <footer className="footer">
      <div className="actions">
        <h5>Actions</h5>
        <button className="button" onClick={handleAllCompleted}>
          Mark All Completed
        </button>
        <button className="button" onClick={handleClearCompleted}>
          Clear Completed
        </button>
      </div>

      <RemainingTodos count={todosRemaining} />
      <StatusFilter value={status} onChange={onStatusChange} />
      <ColorFilters value={colors} onChange={onColorChange} />
    </footer>
  );
};

export default Footer;
