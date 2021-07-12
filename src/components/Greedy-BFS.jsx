function GreedyBestFirstSearch(
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

  let sourceRow, sourceColumn, sinkRow, sinkColumn;

  for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < columnCount; j++) {
      if (tempGrid[i][j].checkSource) {
        tempGrid[i][j].distance = 0;
        sourceRow = i;
        sourceColumn = j;
      } else if (tempGrid[i][j].checkSink) {
        sinkRow = i;
        sinkColumn = j;
      }
    }
  }

  const start = [sourceRow, sourceColumn],
    end = [sinkRow, sinkColumn];
  const dx = [0, 1, 0, -1],
    dy = [1, 0, -1, 0];

  function distance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  let dist = [],
    prev = [];
  for (let i = 0; i < rowCount; i++) {
    let distRow = [],
      prevRow = [];
    for (let j = 0; j < columnCount; j++) {
      distRow.push(Infinity);
      prevRow.push([i, j]);
    }
    dist.push(distRow);
    prev.push(prevRow);
  }

  dist[start[0]][start[1]] = 0;

  let queue = [];
  queue.push(start);
  while (queue.length > 0) {
    let sz = queue.length;
    const [x1, y1] = queue[0];
    let dis = distance(x1, y1, end[0], end[1]);
    let index = 0;
    for (let j = 1; j < sz; j++) {
      let [x1, y1] = queue[j];
      if (dis > distance(x1, y1, end[0], end[1])) {
        dis = distance(x1, y1, end[0], end[1]);
        index = j;
      }
    }
    let temp = queue[0];
    queue[0] = queue[index];
    queue[index] = temp;
    let curr = queue.shift();

    if (
      !(
        (sourceRow === curr[0] && sourceColumn === curr[1]) ||
        (sinkRow === curr[0] && sinkColumn === curr[1])
      )
    )
      setTimeout(() => markExplored(curr[0], curr[1]), 0);

    if (curr[0] === end[0] && curr[1] === end[1]) {
      curr = prev[curr[0]][curr[1]];
      while (true) {
        let temp = curr;
        if (
          !(
            (sourceRow === temp[0] && sourceColumn === temp[1]) ||
            (sinkRow === temp[0] && sinkColumn === temp[1])
          )
        )
          setTimeout(() => markPath(temp[0], temp[1]), 0);
        if (curr === start) {
          setTimeout(() => setFoundPath(true), 0);
          break;
        }
        curr = prev[curr[0]][curr[1]];
      }
      return;
    }
    for (let i = 0; i < 4; i++) {
      let next = [curr[0] + dx[i], curr[1] + dy[i]];
      if (
        next[0] >= 0 &&
        next[0] < rowCount &&
        next[1] >= 0 &&
        next[1] < columnCount &&
        !tempGrid[next[0]][next[1]].isWall &&
        !tempGrid[next[0]][next[1]].isVisited &&
        !tempGrid[next[0]][next[1]].isExplored &&
        dist[next[0]][next[1]] > 1 + dist[curr[0]][curr[1]]
      ) {
        queue.push(next);
        prev[next[0]][next[1]] = curr;
        dist[next[0]][next[1]] = 1 + dist[curr[0]][curr[1]];

        if (
          !(
            (sourceRow === next[0] && sourceColumn === next[1]) ||
            (sinkRow === next[0] && sinkColumn === next[1])
          )
        )
          setTimeout(() => markVisited(next[0], next[1]), 0);
      }
    }
  }
  setTimeout(() => setFoundPath(true), 0);
}

export default GreedyBestFirstSearch;
