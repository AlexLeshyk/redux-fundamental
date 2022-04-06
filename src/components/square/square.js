const Square = ({ value, onHandleClick }) => {
  console.log("props", value, onHandleClick);
  return (
    <button className="square" onClick={onHandleClick}>
      {value}
    </button>
  );
};

export default Square;
