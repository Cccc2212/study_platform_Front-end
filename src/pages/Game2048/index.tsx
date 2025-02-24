// import React, { useState, useEffect } from 'react';
// import './index.less';
//
// const Game2048: React.FC = () => {
//   const size = 4; // 游戏棋盘大小 (4x4)
//   const [board, setBoard] = useState<number[][]>([]);
//   const [gameOver, setGameOver] = useState(false);
//   const [score, setScore] = useState(0);
//
//   // 初始化棋盘
//   const initializeBoard = () => {
//     const emptyBoard = Array(size).fill(null).map(() => Array(size).fill(0));
//     setBoard(emptyBoard);
//     addRandomTile(emptyBoard);
//     addRandomTile(emptyBoard);
//   };
//
//   // 添加随机数字 2 或 4
//   const addRandomTile = (board: number[][]) => {
//     const emptyCells: { row: number, col: number }[] = [];
//
//     for (let r = 0; r < size; r++) {
//       for (let c = 0; c < size; c++) {
//         if (board[r][c] === 0) {
//           emptyCells.push({ row: r, col: c });
//         }
//       }
//     }
//
//     if (emptyCells.length > 0) {
//       const randomIndex = Math.floor(Math.random() * emptyCells.length);
//       const { row, col } = emptyCells[randomIndex];
//       const randomValue = Math.random() < 0.9 ? 2 : 4;
//       board[row][col] = randomValue;
//       setBoard([...board]);
//     }
//   };
//
//   // 合并相同数字
//   const slideAndMerge = (line: number[]): number[] => {
//     const newLine = line.filter(num => num !== 0);  // 去除零
//     for (let i = 0; i < newLine.length - 1; i++) {
//       if (newLine[i] === newLine[i + 1]) {
//         newLine[i] *= 2;
//         newLine[i + 1] = 0;
//         setScore(score + newLine[i]);
//       }
//     }
//     return newLine.filter(num => num !== 0);  // 再次去除零
//   };
//
//   const move = (direction: string) => {
//     let newBoard = JSON.parse(JSON.stringify(board)); // 深拷贝棋盘
//
//     switch (direction) {
//       case 'left':
//         for (let r = 0; r < size; r++) {
//           newBoard[r] = slideAndMerge(newBoard[r]);
//           while (newBoard[r].length < size) {
//             newBoard[r].push(0);
//           }
//         }
//         break;
//       case 'right':
//         for (let r = 0; r < size; r++) {
//           newBoard[r] = slideAndMerge(newBoard[r].reverse()).reverse();
//           while (newBoard[r].length < size) {
//             newBoard[r].push(0);
//           }
//         }
//         break;
//       case 'up':
//         for (let c = 0; c < size; c++) {
//           const column = board.map(row => row[c]);
//           const newColumn = slideAndMerge(column);
//           while (newColumn.length < size) {
//             newColumn.push(0);
//           }
//
//           // 确保newBoard的列正确初始化
//           for (let r = 0; r < size; r++) {
//             if (!newBoard[r]) newBoard[r] = [];  // 确保每一行被初始化
//             newBoard[r][c] = newColumn[r];
//           }
//         }
//         break;
//       case 'down':
//         for (let c = 0; c < size; c++) {
//           const column = board.map(row => row[c]).reverse();
//           const newColumn = slideAndMerge(column).reverse();
//           while (newColumn.length < size) {
//             newColumn.push(0);
//           }
//
//           // 确保newBoard的列正确初始化
//           for (let r = 0; r < size; r++) {
//             if (!newBoard[r]) newBoard[r] = [];  // 确保每一行被初始化
//             newBoard[r][c] = newColumn[r];
//           }
//         }
//         break;
//       default:
//         return;
//     }
//
//     addRandomTile(newBoard);
//     setBoard(newBoard);
//     checkGameOver(newBoard);
//   };
//
//   // 检查游戏是否结束
//   const checkGameOver = (board: number[][]) => {
//     let gameOver = true;
//
//     // 如果棋盘上还有 0，游戏未结束
//     for (let r = 0; r < size; r++) {
//       for (let c = 0; c < size; c++) {
//         if (board[r][c] === 0) {
//           gameOver = false;
//           break;
//         }
//       }
//     }
//
//     if (gameOver) {
//       // 如果没有空格，检查是否能合并
//       for (let r = 0; r < size; r++) {
//         for (let c = 0; c < size - 1; c++) {
//           if (board[r][c] === board[r][c + 1] || board[c][r] === board[c + 1][r]) {
//             gameOver = false;
//             break;
//           }
//         }
//       }
//     }
//
//     if (gameOver) {
//       setGameOver(true);
//     }
//   };
//
//   // 监听键盘事件
//   const handleKeyDown = (event: KeyboardEvent) => {
//     if (gameOver) return;
//
//     switch (event.key) {
//       case 'ArrowLeft':
//         move('left');
//         break;
//       case 'ArrowRight':
//         move('right');
//         break;
//       case 'ArrowUp':
//         move('up');
//         break;
//       case 'ArrowDown':
//         move('down');
//         break;
//       default:
//         break;
//     }
//   };
//
//   // 初始化棋盘和监听事件
//   useEffect(() => {
//     initializeBoard();
//     document.addEventListener('keydown', handleKeyDown);
//
//     return () => {
//       document.removeEventListener('keydown', handleKeyDown);
//     };
//   }, []);
//
//   // 重启游戏
//   const restartGame = () => {
//     setGameOver(false);
//     setScore(0);
//     initializeBoard();
//   };
//
//   return (
//     <div className="game-container">
//       <h1>2048</h1>
//       {gameOver && <div className="game-over">游戏结束！</div>}
//       <h2>得分: {score}</h2>
//       <div className="board">
//         {board.map((row, rowIndex) => (
//           <div key={rowIndex} className="row">
//             {row.map((cell, colIndex) => (
//               <div key={colIndex} className={`cell cell-${cell}`}>
//                 {cell !== 0 && cell}
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//       <button className="restart-button" onClick={restartGame}>重新开始</button>
//     </div>
//   );
// };
//
// export default Game2048;
