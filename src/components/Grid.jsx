import React, { useState } from "react";
import Square from "./Square";
import Button from "./Button";
import Dijkstra from "./Dijkstra";
import Astar from "./A-star";
import GreedyBestFirstSearch from "./Greedy-BFS";

function Grid() {
  const [random, setRandom] = useState(0);
  const [isSourceSet, setSource] = useState(false);
  const [isSinkSet, setSink] = useState(false);
  const [readyForWall, setReadyForWall] = useState(false);
  const [noDisturb, setNoDisturb] = useState(false);
  const [foundPath, setFoundPath] = useState(false);

  let grid = [];
  let rowCount = 17,
    columnCount = 52;

  for (let i = 0; i < rowCount; i++) {
    let row = [];

    for (let j = 0; j < columnCount; j++) {
      let curr = {
        rowIndex: i,
        colIndex: j,
        checkClick: false,
        checkSource: false,
        checkSink: false,
        isWall: false,
        isVisited: false,
        parent: {
          rowIndex: null,
          colIndex: null,
        },
        distance: Infinity,
        squareColour: "#FAF1E6",
      };

      if (i === 0 || j === 0 || i === rowCount - 1 || j === columnCount - 1) {
        curr.isWall = true;
        curr.squareColour = "#125D98";
        curr.checkClick = true;
      }

      row.push(curr);
    }

    grid.push(row);
  }

  const [finalGrid, changeGrid] = useState(grid);

  const updateGrid = (tempGrid) => {
    changeGrid(tempGrid);
    setRandom(Math.random());
  };

  function handleSquareClick(location) {
    const { rowIndex: row, colIndex: col } = location;

    let tempGrid = finalGrid;

    for (let i = 1; i < rowCount - 1; i++) {
      for (let j = 1; j < columnCount - 1; j++) {
        if (i !== row || j !== col) {
          if (
            tempGrid[i][j].checkSource === false &&
            tempGrid[i][j].checkSink === false &&
            tempGrid[i][j].isWall === false
          ) {
            tempGrid[i][j].squareColour = "#FAF1E6";
            tempGrid[i][j].checkClick = false;
          }
        } else {
          if (!tempGrid[i][j].checkSource && !tempGrid[i][j].checkSink) {
            tempGrid[row][col].checkClick = true;
            tempGrid[row][col].squareColour = "blue";
          }
        }
      }
    }

    updateGrid(tempGrid);
    setRandom(Math.random());
  }

  function handleButtonClick(buttonColour) {
    if (noDisturb) return;

    buttonColour = buttonColour === "#91BD3A" ? "green" : "red";

    let tempGrid = finalGrid;

    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < columnCount; j++) {
        if (tempGrid[i][j].squareColour === "blue") {
          if (
            (buttonColour === "green" && !isSourceSet) ||
            (buttonColour === "red" && !isSinkSet)
          ) {
            tempGrid[i][j].squareColour = buttonColour;
            tempGrid[i][j].checkSource = buttonColour === "green";
            tempGrid[i][j].checkSink = buttonColour === "red";

            if (buttonColour === "green") {
              tempGrid[i][j].isVisited = true;
              setSource(true);
            } else setSink(true);
          }
        }
      }
    }

    updateGrid(tempGrid);
    setRandom(Math.random());
  }

  function createWall(location) {
    if (noDisturb || !readyForWall) {
      return false;
    }

    const { rowIndex: row, colIndex: col } = location;

    let tempGrid = finalGrid;

    if (
      !tempGrid[row][col].checkSource &&
      !tempGrid[row][col].checkSink &&
      tempGrid[row][col].squareColour === "#FAF1E6"
    ) {
      tempGrid[row][col].squareColour = "#125D98";
      tempGrid[row][col].isWall = true;
      updateGrid(tempGrid);
      setRandom(Math.random());
    }
    return true;
  }

  function markVisited(row, col) {
    let tempGrid = finalGrid;
    tempGrid[row][col].isVisited = true;
    tempGrid[row][col].squareColour = "#C68B59";

    updateGrid(tempGrid);
    setRandom(Math.random());
  }

  function markExplored(row, col) {
    let tempGrid = finalGrid;
    tempGrid[row][col].squareColour = "#C84B31";

    updateGrid(tempGrid);
    setRandom(Math.random());
  }

  function markPath(row, col) {
    let tempGrid = finalGrid;
    tempGrid[row][col].squareColour = "yellow";

    updateGrid(tempGrid);
    setRandom(Math.random());
  }

  function resetGrid() {
    if (noDisturb && !foundPath) return;

    setNoDisturb(false);
    setFoundPath(false);
    setReadyForWall(false);
    setSource(false);
    setSink(false);
    updateGrid(grid);
  }

  return (
    <div>
      <div className="heading">
        <h1>Pathfinding Algorithms Visualizer</h1>
      </div>

      <div className="grid">
        {finalGrid.map((row, rowIdx) => {
          return (
            <div className="row" key={rowIdx}>
              {row.map((square, colIdx) => {
                return (
                  <Square
                    key={[rowIdx, colIdx]}
                    id={{
                      rowIndex: rowIdx,
                      colIndex: colIdx,
                    }}
                    squareColour={finalGrid[rowIdx][colIdx].squareColour}
                    checkClick={finalGrid[rowIdx][colIdx].checkClick}
                    handleSquareClick={handleSquareClick}
                    isWall={finalGrid[rowIdx][colIdx].isWall}
                    readyForWall={readyForWall}
                    createWall={createWall}
                    setReadyForWall={setReadyForWall}
                    isSourceSet={isSourceSet}
                    isSinkSet={isSinkSet}
                    noDisturb={noDisturb}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="button-group">
        <Button
          name="Set Start Point"
          colour="#91BD3A"
          handleButtonClick={handleButtonClick}
          canClick={!noDisturb}
        />
        <Button
          name="Set End Point"
          colour="#FB3640"
          handleButtonClick={handleButtonClick}
          canClick={!noDisturb}
        />

        <Button
          name="Dijkstra Algorithm"
          colour="#FECD1A"
          handleButtonClick={() =>
            Dijkstra(
              finalGrid,
              updateGrid,
              rowCount,
              columnCount,
              isSourceSet,
              isSinkSet,
              markVisited,
              markExplored,
              markPath,
              setNoDisturb,
              setFoundPath
            )
          }
          canClick={!noDisturb}
        />

        <Button
          name="Greedy Best First Search Algorithm"
          colour="#FECD1A"
          handleButtonClick={() =>
            GreedyBestFirstSearch(
              finalGrid,
              updateGrid,
              rowCount,
              columnCount,
              isSourceSet,
              isSinkSet,
              markVisited,
              markExplored,
              markPath,
              setNoDisturb,
              setFoundPath
            )
          }
          canClick={!noDisturb}
        />

        <Button
          name="A* Algorithm"
          colour="#FECD1A"
          handleButtonClick={() =>
            Astar(
              finalGrid,
              updateGrid,
              rowCount,
              columnCount,
              isSourceSet,
              isSinkSet,
              markVisited,
              markExplored,
              markPath,
              setNoDisturb,
              setFoundPath
            )
          }
          canClick={!noDisturb}
        />

        <Button
          name="Reset Grid"
          colour="#D1D9D9"
          handleButtonClick={resetGrid}
          canClick={!noDisturb || foundPath}
        />
      </div>
    </div>
  );
}

export default Grid;
