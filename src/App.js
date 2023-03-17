import React, { useEffect, useState } from "react";
import Pathfinding from "pathfinding";
import "./App.css";

const CELL_SIZE = 20;
const MOVE_SPEED = 90;

const App = () => {
  const [grid, setGrid] = useState([]);
  const [bluePos, setBluePos] = useState({ x: 0, y: 0 });
  const [greenPos, setGreenPos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const [blueWins, setBlueWins] = useState(0);
  const [greenWins, setGreenWins] = useState(0);
  const [infoVisible, setInfoVisible] = useState(false);

  const randomPosition = (maxX, maxY) => ({
    x: Math.floor(Math.random() * maxX),
    y: Math.floor(Math.random() * maxY),
  });

  const createGrid = (width, height) => {
    const newGrid = new Array(height).fill(null).map(() =>
      new Array(width).fill(0)
    );

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (Math.random() < 0.2) {
          newGrid[y][x] = 1;
        }
      }
    }

    return newGrid;
  };

  const initGame = () => {
    const gridWidth = Math.floor(window.innerWidth / CELL_SIZE);
    const gridHeight = Math.floor(window.innerHeight / CELL_SIZE);

    const newGrid = createGrid(gridWidth, gridHeight);
    setGrid(newGrid);

    setBluePos(randomPosition(gridWidth, gridHeight));
    setGreenPos(randomPosition(gridWidth, gridHeight));
    setTargetPos(randomPosition(gridWidth, gridHeight));
  };

  const findPath = (startPos, endPos, grid) => {
    const finder = new Pathfinding.AStarFinder();
    const path = finder.findPath(
      startPos.x,
      startPos.y,
      endPos.x,
      endPos.y,
      new Pathfinding.Grid(grid)
    );
    return path;
  };

  const move = (currentPos, nextPos) => {
    if (nextPos) {
      return { x: nextPos[0], y: nextPos[1] };
    }
    return currentPos;
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const bluePath = findPath(bluePos, targetPos, grid);
      const greenPath = findPath(greenPos, targetPos, grid);

      if (bluePath.length === 0 && greenPath.length === 0) {
        clearInterval(intervalId);
        initGame();
      } else {
        setBluePos(move(bluePos, bluePath[1]));
        setGreenPos(move(greenPos, greenPath[1]));

        if (bluePos.x === targetPos.x && bluePos.y === targetPos.y) {
          clearInterval(intervalId);
          setBlueWins(blueWins + 1);
          initGame();
        } else if (greenPos.x === targetPos.x && greenPos.y === targetPos.y) {
          clearInterval(intervalId);
          setGreenWins(greenWins + 1);
          initGame();
        }
      }
    }, MOVE_SPEED);

    return () => clearInterval(intervalId);
  }, [bluePos, greenPos, targetPos, grid]);

  return (
    
    <div
      className="grid"
      style={{
        width: grid[0]?.length * CELL_SIZE,
        height: grid.length * CELL_SIZE,
        gridTemplateColumns: `repeat(${grid[0]?.length || 0}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${grid.length}, ${CELL_SIZE}px)`,
        transform: `scale(${Math.min(
          window.innerWidth / (grid[0]?.length * CELL_SIZE),
          window.innerHeight / (grid.length * CELL_SIZE)
        )})`,
        transformOrigin: "0 0",
      }}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`cell-${x}-${y}`}
            className={`cell ${cell === 1 ? "wall" : ""}`}
            style={{
              gridColumnStart: x + 1,
              gridRowStart: y + 1,
            }}
          >
            {bluePos.x === x && bluePos.y === y && (
              <div className="blue" style={{ width: CELL_SIZE, height: CELL_SIZE }} />
            )}
            {greenPos.x === x && greenPos.y === y && (
              <div className="green" style={{ width: CELL_SIZE, height: CELL_SIZE }} />
            )}
            {targetPos.x === x && targetPos.y === y && (
              <div className="target" style={{ width: CELL_SIZE, height: CELL_SIZE }} />
            )}
          </div>
        ))
      )}
      <div
        className={`info-container ${infoVisible ? "expanded" : ""}`}
        onClick={() => setInfoVisible(!infoVisible)}
      >
        <div className="info-circle">
          {!infoVisible && <span className="question-mark">?</span>}
          {infoVisible && (
            <div className="info-content">
              <div>Blue: {blueWins} Green: {greenWins}</div>
              <div>Author: Chris Dzoba & GPT-4</div>
              <div>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>{" "}
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
                  Github
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  
};

export default App;

