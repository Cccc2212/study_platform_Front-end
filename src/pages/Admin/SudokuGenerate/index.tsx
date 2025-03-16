// E:\codeproject\myapp\src\pages\SudokuManage\index.tsx
import React, { useState } from 'react';
import { Button, Select, message, Card } from 'antd';
import { saveSudokuPuzzle } from '@/services/ant-design-pro/api';
import './index.less';

const { Option } = Select;

const SudokuGenerate: React.FC = () => {
  const [solution, setSolution] = useState<string[][]>([]); // 完整答案
  const [initialBoard, setInitialBoard] = useState<string[][]>([]); // 挖空后的题目
  const [difficulty, setDifficulty] = useState<number | null>(null); // 难度（控制挖空数量）
  const [digMethod, setDigMethod] = useState<string | null>(null); // 挖空方式
  const [showSolution, setShowSolution] = useState(false); // 是否显示完整答案

  // 使用拉斯维加斯算法生成数独答案
  const generateSolution = () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const board = lasVegasSudoku();
    if (board) {
      setSolution(board);
      setInitialBoard(board.map((row) => [...row]));
      setShowSolution(false); // 生成新答案时隐藏完整答案
      message.success('数独答案生成成功！');
    } else {
      message.error('生成数独答案失败！');
    }
  };

  // 拉斯维加斯算法实现
  const lasVegasSudoku = (): string[][] | null => {
    const board = Array(9)
      .fill(null)
      .map(() => Array(9).fill('0'));
    for (let i = 0; i < 9; i += 3) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      if (!fillSubGrid(board, i, i)) return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (!fillRemaining(board, 0, 0)) return null;
    return board;
  };

  const fillSubGrid = (board: string[][], row: number, col: number): boolean => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let index = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[row + i][col + j] = nums[index++].toString();
      }
    }
    return true;
  };

  const shuffleArray = (array: number[]): number[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fillRemaining = (board: string[][], row: number, col: number): boolean => {
    if (row === 9) return true;
    if (col === 9) return fillRemaining(board, row + 1, 0);
    if (board[row][col] !== '0') return fillRemaining(board, row, col + 1);
    const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const num of nums) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      if (isValid(board, row, col, num.toString())) {
        board[row][col] = num.toString();
        if (fillRemaining(board, row, col + 1)) return true;
        board[row][col] = '0';
      }
    }
    return false;
  };

  const isValid = (board: string[][], row: number, col: number, num: string): boolean => {
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num || board[x][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  };

  // 根据选择的挖空方式执行挖空
  const digHoles = () => {
    if (!difficulty) {
      message.error('请选择难度！');
      return;
    }
    if (!digMethod) {
      message.error('请选择挖空方式！');
      return;
    }
    if (solution.length === 0) {
      message.error('请先生成数独答案！');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const holes = getHolesCount(difficulty);
    const newBoard = solution.map((row) => [...row]);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    digByMethod(newBoard, digMethod, holes);
    setInitialBoard(newBoard);
    message.success('数独题目生成成功！');
  };

  // 根据难度返回挖空数量
  const getHolesCount = (diff: number): number => {
    switch (diff) {
      case 1:
        return 10; // 简单
      case 2:
        return 20; // 中等
      case 3:
        return 30; // 困难
      case 4:
        return 40; // 极难
      case 5:
        return 50; // 地狱
      default:
        return 30;
    }
  };

  // 根据挖空方式执行挖空
  const digByMethod = (board: string[][], method: string, holes: number) => {
    let count = 0;
    if (method === 'random') {
      while (count < holes) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (board[row][col] !== '0') {
          board[row][col] = '0';
          count++;
        }
      }
    } else if (method === 'interval') {
      let cells: [number, number][] = [];
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j += 2) {
          cells.push([i, j]);
        }
      }
      // @ts-ignore
      cells = shuffleArray(cells as any);
      for (const [row, col] of cells) {
        if (count >= holes) break;
        if (board[row][col] !== '0') {
          board[row][col] = '0';
          count++;
        }
      }
    } else if (method === 'snake') {
      const cells: [number, number][] = [];
      const a = Math.floor(Math.random() * 9);
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j += 2) {
          cells.push([i, i % 2 === 0 ? j : a - j]);
        }
      }
      for (const [row, col] of cells) {
        if (count >= holes) break;
        if (board[row][col] !== '0') {
          board[row][col] = '0';
          count++;
        }
      }
    }
  };

  // 保存到后端
  const handleSave = async () => {
    if (initialBoard.length === 0 || solution.length === 0) {
      message.error('请先生成题目和答案！');
      return;
    }
    try {
      const puzzle = {
        initial_board: JSON.stringify(initialBoard),
        solution: JSON.stringify(solution),
        difficulty: difficulty || 1,
      };
      await saveSudokuPuzzle(puzzle);
      message.success('数独题目保存成功！');
    } catch (error) {
      console.error('保存数独失败:', error);
      message.error('保存数独失败！');
    }
  };

  // 切换显示完整答案
  const toggleSolution = () => {
    if (solution.length === 0) {
      message.error('请先生成数独答案！');
      return;
    }
    setShowSolution(!showSolution);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Button type="primary" onClick={generateSolution} style={{ marginRight: '10px' }}>
          生成数独答案
        </Button>
        <Select
          placeholder="请选择难度"
          style={{ width: 120, marginRight: '10px' }}
          onChange={(value: number) => setDifficulty(value)}
          value={difficulty}
        >
          <Option value={1}>简单 (10)</Option>
          <Option value={2}>中等 (20)</Option>
          <Option value={3}>困难 (30)</Option>
          <Option value={4}>极难 (40)</Option>
          <Option value={5}>地狱 (50)</Option>
        </Select>
        <Select
          placeholder="请决定挖空方式"
          style={{ width: 150, marginRight: '10px' }}
          onChange={(value: string) => setDigMethod(value)}
          value={digMethod}
        >
          <Option value="random">随机</Option>
          <Option value="interval">间隔</Option>
          <Option value="snake">蛇形</Option>
        </Select>
        <Button type="default" onClick={digHoles} style={{ marginRight: '10px' }}>
          执行挖空
        </Button>
        <Button type="default" onClick={toggleSolution} style={{ marginRight: '10px' }}>
          {showSolution ? '隐藏完整答案' : '查看完整答案'}
        </Button>
        <Button type="primary" onClick={handleSave}>
          保存到数据库
        </Button>
      </div>
      <Card title="当前数独题目">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 40px)', gap: '5px' }}>
          {initialBoard.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  backgroundColor: cell === '0' ? '#f0f0f0' : 'white',
                  fontWeight: cell === '0' ? 'normal' : 'bold',
                }}
              >
                {cell !== '0' ? cell : ''}
              </div>
            )),
          )}
        </div>
      </Card>
      {showSolution && (
        <Card title="完整数独答案" style={{ marginTop: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 40px)', gap: '5px' }}>
            {solution.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}-solution`}
                  style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px solid #ccc',
                    backgroundColor: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {cell}
                </div>
              )),
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SudokuGenerate;
