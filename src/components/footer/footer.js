import { useSelector, useDispatch } from "react-redux";
import ColorFilters from "./colorFilters";
import RemainingTodos from "./remainingTodos";
import StatusFilter from "./statusFilter";
import { colorFilterChanged, statusFilterChanged } from "../filters/filtersSlice";
import { completedCleared, allCompleted, selectTodos } from "../todos/todosSlice";

const Footer = () => {
  const { colors, status } = useSelector((state) => state.filters);
  const todosRemaining = useSelector((state) => {
    const uncompletedTodos = selectTodos(state).filter((todo) => !todo.completed);
    return uncompletedTodos.length;
  });
  const dispatch = useDispatch();

  const onColorChange = (color, changeType) => {
    dispatch(colorFilterChanged(color, changeType));
  };
  const onStatusChange = (status) => {
    dispatch(statusFilterChanged(status));
  };

  const handleAllCompleted = () => {
    dispatch(allCompleted());
  };

  const handleClearCompleted = () => {
    dispatch(completedCleared());
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
