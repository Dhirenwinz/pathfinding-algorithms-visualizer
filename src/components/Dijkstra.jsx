function Dijkstra(
  tempGrid,
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
) {
  if (!isSourceSet || !isSinkSet) {
    return;
  }

  setNoDisturb(true);

  let q = [];

  let sourceRow, sourceColumn, sinkRow, sinkColumn;

  for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < columnCount; j++) {
      if (tempGrid[i][j].checkSource) {
        tempGrid[i][j].distance = 0;
        q.push(tempGrid[i][j]);
        sourceRow = i;
        sourceColumn = j;
      } else if (tempGrid[i][j].checkSink) {
        sinkRow = i;
        sinkColumn = j;
      }
    }
  }

  let row = [0, -1, 0, 1];
  let col = [1, 0, -1, 0];

  while (q.length !== 0) {
    const curr = q.shift();
    //Explore function

    if (!curr.checkSource) {
      setTimeout(() => markExplored(curr.rowIndex, curr.colIndex), 0);
    }

    for (let k = 0; k < 4; k++) {
      let nr = curr.rowIndex + row[k];
      let nc = curr.colIndex + col[k];

      if (
        nr < rowCount &&
        nr >= 0 &&
        nc < columnCount &&
        nc >= 0 &&
        !tempGrid[nr][nc].isWall &&
        tempGrid[nr][nc].distance >
          1 + tempGrid[curr.rowIndex][curr.colIndex].distance
      ) {
        tempGrid[nr][nc].parent.rowIndex = curr.rowIndex;
        tempGrid[nr][nc].parent.colIndex = curr.colIndex;
        tempGrid[nr][nc].distance =
          1 + tempGrid[curr.rowIndex][curr.colIndex].distance;

        if (!tempGrid[nr][nc].checkSink) {
          setTimeout(
            () =>
              markVisited(tempGrid[nr][nc].rowIndex, tempGrid[nr][nc].colIndex),
            0
          );
        } else {
          tempGrid[nr][nc].isVisited = true;
          break;
        }
        q.push(tempGrid[nr][nc]);
      }
    }

    if (tempGrid[sinkRow][sinkColumn].isVisited) break;
  }

  while (q.length !== 0) {
    let curr = q.shift();
    setTimeout(() => markExplored(curr.rowIndex, curr.colIndex), 0);
  }

  let curr = tempGrid[sinkRow][sinkColumn];

  while (curr.parent.rowIndex != null) {
    let parRow = curr.parent.rowIndex,
      parColumn = curr.parent.colIndex;

    if (parRow === sourceRow && parColumn === sourceColumn) {
      break;
    }

    setTimeout(() => markPath(parRow, parColumn), 0);

    curr = tempGrid[parRow][parColumn];
  }

  setTimeout(() => setFoundPath(true), 0);
}

export default Dijkstra;
