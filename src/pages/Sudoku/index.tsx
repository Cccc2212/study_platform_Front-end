import React, { useEffect, useState } from 'react';
import { Button, Card, message, Tooltip, Select } from 'antd';
import { BilibiliFilled, QuestionCircleOutlined } from '@ant-design/icons';
import './index.less';
import { getRandomPuzzleByDifficulty } from '@/services/ant-design-pro/api';
import { random } from 'lodash';

const { Option } = Select;

const SudokuPage: React.FC<{
  onFinish: (timeSpent: number, isCorrect: boolean) => void;
  difficulty?: number;
}> = ({ onFinish, difficulty }) => {
  const [board, setBoard] = useState<number[][]>([]);
  const [initialBoard, setInitialBoard] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [timer, setTimer] = useState(0);
  const [timeUp, setTimeUp] = useState(false);

  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        const data = await getRandomPuzzleByDifficulty({ difficulty });
        if (data && data.initial_board && data.solution) {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const initialBoard = JSON.parse(data.initial_board);
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const solution = JSON.parse(data.solution);
          setBoard(initialBoard);
          setInitialBoard(initialBoard);
          setSolution(solution);
        } else {
          message.error('无效的数独数据');
        }
      } catch (error) {
        console.error('获取数独题目失败:', error);
        message.error('获取数独题目失败');
      }
    };

    fetchPuzzle();
  }, [difficulty]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 600) {
          setTimeUp(true);
          clearInterval(interval);
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          onFinish(timer, checkSolution(board));
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, onFinish, board]);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const isValidMove = (board: number[][], row: number, col: number, num: number): boolean => {
    for (let i = 0; i < 9; i++) {
      if (Number(board[row][i]) === Number(num)) {
        message.error('同行列数字不能相同');
        return false;
      }
    }
    for (let i = 0; i < 9; i++) {
      if (Number(board[i][col]) === Number(num)) {
        message.error('同行列数字不能相同');
        return false;
      }
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (Number(board[startRow + i][startCol + j]) === Number(num)) {
          message.error('每个3x3内不能有相同数字');
          return false;
        }
      }
    }
    return true;
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const checkSolution = (board: number[][], solution: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (Number(board[row][col]) !== Number(solution[row][col])) {
          return false;
        }
      }
    }
    return true;
  };

  const handleCellClick = (row: number, col: number) => {
    const cellValue = board[row][col];
    const solutionValue = solution[row][col];
    if (Number(cellValue) !== Number(solutionValue)) {
      setSelectedCell({ row, col });
    } else {
      message.error('该格子是题目或者已经正确，无法修改！');
    }
  };

  const handleNumberInput = (num: number) => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      if (board[row][col] !== solution[row][col]) {
        if (isValidMove(board, row, col, num)) {
          const newBoard = [...board];
          newBoard[row][col] = num;
          setBoard(newBoard);
          setSelectedCell(null);
        } else {
          message.error('无效的数字！（不符合规则）');
        }
      } else {
        message.warning('该格子是题目或者已经正确，无法修改！');
      }
    }
  };

  const handleExit = () => {
    onFinish(timer, checkSolution(board, solution));
  };

  const handleCheck = () => {
    const isCorrect = checkSolution(board, solution);
    console.log(initialBoard);
    if (isCorrect) {
      onFinish(timer, isCorrect);
    } else {
      message.error('答案错误，请再试一次！');
    }
  };

  if (board.length === 0 || solution.length === 0) {
    return <div>加载中...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      {timeUp && <p style={{ color: 'red', fontWeight: 'bold' }}>时间到</p>}
      <div style={{ fontSize: '20px', marginBottom: '20px' }}>
        <strong>计时器（10分钟自动结束）：</strong> {timer} 秒
      </div>
      <Tooltip title="数独规则：在9x9的格子中填入1至9的数字。每一行、每一列、每个3x3的小格子内，数字不能重复。">
        <Button
          type="link"
          icon={<QuestionCircleOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
        />
      </Tooltip>
      <Card title="数独棋盘">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 40px)', gap: '5px' }}>
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                style={{
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  backgroundColor:
                    selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                      ? '#e6f7ff'
                      : 'white',
                  fontWeight: cell === 0 ? 'normal' : 'bold',
                  color:
                    cell === 0 || board[rowIndex][colIndex] === solution[rowIndex][colIndex]
                      ? 'black'
                      : 'gray',
                  cursor: cell === 0 ? 'pointer' : 'not-allowed',
                }}
              >
                {Number(cell) !== 0 ? cell : ''}
              </div>
            )),
          )}
        </div>
      </Card>
      <div style={{ marginTop: '20px' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button key={num} onClick={() => handleNumberInput(num)} style={{ margin: '5px' }}>
            {num}
          </Button>
        ))}
      </div>
      <div style={{ marginTop: '20px' }}>
        <Button type="primary" onClick={handleExit} danger>
          退出游戏
        </Button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <Button type="default" onClick={handleCheck}>
          检查答案
        </Button>
      </div>
    </div>
  );
};

const ResultPage: React.FC<{ timeSpent: number; isCorrect: boolean }> = ({
  timeSpent,
  isCorrect,
}) => {
  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1>游戏结果</h1>
      <p>您花费了 {timeSpent} 秒。</p>
      <p>{isCorrect ? '恭喜你:)，挑战成功！' : '挑战失败:(，请再试一次！'}</p>
      <Button type="primary" onClick={handleRestart}>
        再次挑战:)
      </Button>
    </div>
  );
};

const SudokuMainPage: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [difficulty, setDifficulty] = useState<number | null>(null);

  const startGame = () => {
    if (difficulty === null) {
      message.error('请选择难度！(难度暂时仅供参考)');
      return;
    }
    setStarted(true);
    setFinished(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const finishGame = (time: number, isCorrect: boolean) => {
    setTimeSpent(time);
    setIsCorrect(isCorrect);
    setStarted(false);
    setFinished(true);
  };

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  return (
    <div>
      {!started && !finished && (
        <div style={{ textAlign: 'center', paddingTop: '100px' }}>
          <h1>欢迎来到数独游戏:)</h1>
          <div style={{ margin: '20px 0' }}>
            <span style={{ marginRight: '10px' }}>选择难度：</span>
            <Select
              placeholder="请选择难度"
              style={{ width: 120 }}
              onChange={(value: number) => setDifficulty(value)}
              value={difficulty}
            >
              <Option value={1}>简单:)</Option>
              <Option value={2}>中等:|</Option>
              <Option value={3}>困难:(</Option>
              <Option value={4}>极难:O</Option>
              <Option value={random()}>随机难度</Option>
            </Select>
          </div>
          <Button type="primary" size="large" onClick={startGame}>
            开始游戏:)
          </Button>
          <br /> <br />
          <Tooltip title="数独规则：在9x9的格子中填入1至9的数字。每一行、每一列、每个3x3的小格子内，数字不能重复。">
            <Button
              type="link"
              icon={<QuestionCircleOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
            />
          </Tooltip>
          <br /> <br />
          <Button
            type="link"
            icon={<BilibiliFilled style={{ fontSize: '20px', color: '#1890ff' }} />}
            href="https://www.bilibili.com/video/BV1Ag4y147kj/?spm_id_from=333.337.search-card.all.click"
          >
            视频教学
          </Button>
        </div>
      )}
      {started && !finished && (
        <SudokuPage onFinish={finishGame} difficulty={difficulty}></SudokuPage>
      )}
      {finished && <ResultPage timeSpent={timeSpent} isCorrect={isCorrect} />}
    </div>
  );
};

export default SudokuMainPage;
