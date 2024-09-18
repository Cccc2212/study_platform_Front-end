import React, { useEffect, useState } from 'react';
import { Button, Card, message, Progress, Radio, Space } from 'antd';

// 模拟题目数据
const questions = [
  {
    id: 1,
    question: '法国的首都是哪里？',
    options: ['巴黎', '伦敦', '柏林', '罗马'],
    correctAnswer: '巴黎',
  },
  {
    id: 2,
    question: '哪个星球被称为红色星球？',
    options: ['地球', '火星', '木星', '金星'],
    correctAnswer: '火星',
  },
  {
    id: 3,
    question: '谁写了《哈姆雷特》？',
    options: ['威廉·莎士比亚', '马克·吐温', '查尔斯·狄更斯', 'J.K.罗琳'],
    correctAnswer: '威廉·莎士比亚',
  },
  {
    id: 4,
    question: '世界上最大的沙漠是哪个？',
    options: ['撒哈拉', '戈壁', '卡拉哈里', '大维多利亚'],
    correctAnswer: '撒哈拉',
  },
  {
    id: 5,
    question: '电子计算机发明于哪个世纪？',
    options: ['19世纪', '20世纪', '21世纪', '18世纪'],
    correctAnswer: '20世纪',
  },
];

// 考试页面组件
const ExamPage: React.FC<{
  onFinish: (score: number, questionsAttempted: number, timeSpent: number) => void;
}> = ({ onFinish }) => {
  //当前题目索引
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  //用户选择答案
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  //用户分数
  const [score, setScore] = useState(0);
  //判断是否提交答案
  const [submitted, setSubmitted] = useState(false);
  // 考试时长--60秒
  const [timer, setTimer] = useState(60);
  //用户已尝试回答的题目数量
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  //判断时间是否到
  const [timeUp, setTimeUp] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          setTimeUp(true);
          clearInterval(interval);
          onFinish(score, questionsAttempted, 60 - prev); // 自动结束考试
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);//1000ms=1s

    return () => clearInterval(interval); // 组件卸载时清除计时器
  }, [score, questionsAttempted, onFinish]);

  const handleAnswerChange = (e: any) => {
    setSelectedAnswer(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) {
      message.warning('请选择一个答案。');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    setQuestionsAttempted((prev) => prev + 1);

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
      message.success('正确！');
    } else {
      message.error(`错误！正确答案是 ${currentQuestion.correctAnswer}。`);
    }

    setSubmitted(true);
  };

  const nextQuestion = () => {
    setSubmitted(false);
    setSelectedAnswer(null);

    if (currentQuestionIndex >= questions.length - 1) {
      onFinish(score, questionsAttempted, 60 - timer); // 完成考试
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const exitExam = () => {
    onFinish(score, questionsAttempted, 60 - timer); // 退出时保存成绩
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div style={{ padding: '20px' }}>
      <Progress
        percent={(timer / 60) * 100}
        showInfo={false}
        status={timeUp ? 'exception' : 'active'}
      />
      <h2>考试页面</h2>
      {timeUp && <p style={{ color: 'red', fontWeight: 'bold' }}>时间到</p>}
      <Card title={`问题 ${currentQuestionIndex + 1}: ${currentQuestion.question}`}>
        <Radio.Group onChange={handleAnswerChange} value={selectedAnswer} disabled={submitted}>
          <Space direction="vertical">
            {currentQuestion.options.map((option) => (
              <Radio key={option} value={option}>
                {option}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Card>
      <div style={{ marginTop: '20px' }}>
        {!submitted ? (
          <Button type="primary" onClick={handleSubmit} disabled={!selectedAnswer}>
            提交答案
          </Button>
        ) : (
          <Button onClick={nextQuestion}>
            {currentQuestionIndex >= questions.length - 1 ? '查看结果' : '下一题'}
          </Button>
        )}
        <Button style={{ marginLeft: '10px' }} onClick={exitExam}>
          退出考试
        </Button>
      </div>
    </div>
  );
};

// 结果页面组件
const ResultPage: React.FC<{
  score: number;
  questionsAttempted: number;
  timeSpent: number;
  onRestart: () => void;
}> = ({ score, questionsAttempted, timeSpent, onRestart }) => {
  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1>考试结果</h1>
      <p>
        您做了 {questionsAttempted} 道题，答对了 {score} 道。
      </p>
      <p>您花费了 {timeSpent} 秒。</p>
      <Button type="primary" onClick={onRestart}>
        再次参加考试
      </Button>
    </div>
  );
};

// 主组件，处理页面切换
const MainPage: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  const startExam = () => {
    setStarted(true);
    setFinished(false);
  };

  const finishExam = (finalScore: number, attempted: number, time: number) => {
    setScore(finalScore);
    setQuestionsAttempted(attempted);
    setTimeSpent(time);
    setStarted(false);
    setFinished(true);
  };

  const restartExam = () => {
    setScore(0);
    setQuestionsAttempted(0);
    setTimeSpent(0);
    setStarted(true);
    setFinished(false);
  };

  return (
    <div>
      {!started && !finished && (
        <div style={{ textAlign: 'center', paddingTop: '100px' }}>
          <h1>欢迎参加每日知识在线问答:)</h1>
          <br />
          <Button type="primary" size="large" onClick={startExam}>
            开始今日测试
          </Button>
        </div>
      )}
      {started && !finished && <ExamPage onFinish={finishExam} />}
      {finished && (
        <ResultPage
          score={score}
          questionsAttempted={questionsAttempted}
          timeSpent={timeSpent}
          onRestart={restartExam}
        />
      )}
    </div>
  );
};

export default MainPage;
