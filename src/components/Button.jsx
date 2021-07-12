import React from "react";

function Button(props) {
  let buttonColour = props.colour;

  return (
    <div
      className="button"
      onClick={() => props.canClick && props.handleButtonClick(props.colour)}
      style={{ backgroundColor: buttonColour }}
    >
      {props.name}
    </div>
  );
}

export default Button;
