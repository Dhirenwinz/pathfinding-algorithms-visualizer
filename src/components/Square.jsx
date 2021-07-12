import React from "react";

function Square(props) {
  function handleMouseOver(event) {
    !props.noDisturb &&
      !props.checkClick &&
      !props.isWall &&
      (event.target.style.backgroundColor = "#77ACF1");
  }

  function handleMouseOut(event) {
    !props.noDisturb &&
      !props.checkClick &&
      !props.isWall &&
      (event.target.style.backgroundColor = "#FAF1E6");
  }

  return (
    <div
      className="square"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      style={{ backgroundColor: props.squareColour }}
      onClick={() =>
        !props.noDisturb &&
        (!props.isSourceSet || !props.isSinkSet) &&
        props.handleSquareClick(props.id)
      }
      onMouseDown={() =>
        props.isSourceSet &&
        props.isSinkSet &&
        props.setReadyForWall(true) &&
        props.createWall(props.id)
      }
      onMouseEnter={() => props.createWall(props.id)}
      onMouseUp={() =>
        props.createWall(props.id) && props.setReadyForWall(false)
      }
    ></div>
  );
}

export default Square;
