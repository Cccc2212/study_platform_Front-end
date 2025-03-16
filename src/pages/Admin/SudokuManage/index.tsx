import React, { useEffect, useState } from 'react';
import { Button, message, Modal, Popconfirm, Table } from 'antd';
import { deleteSudoku, searchSudokus } from '@/services/ant-design-pro/api';

interface SudokuItem {
  id: number;
  initial_board: string;
  solution: string;
  difficulty: number;
}

const SudokuManage: React.FC = () => {
  const [sudokus, setSudokus] = useState<SudokuItem[]>([]);
  const [visible, setVisible] = useState(false); // 控制 Modal 显示
  const [selectedSudoku, setSelectedSudoku] = useState<SudokuItem | null>(null); // 当前选中的数独

  // 获取数独题目数据
  const fetchSudokus = async () => {
    try {
      const response = await searchSudokus();
      if (Array.isArray(response)) {
        setSudokus(response);
      } else {
        message.error('获取数独数据失败');
      }
    } catch (error) {
      message.error('加载数独数据时出错');
    }
  };

  useEffect(() => {
    fetchSudokus();
  }, []);

  // 删除数独
  const handleDelete = async (id: number) => {
    try {
      await deleteSudoku({ id });
      message.success('删除成功');
      fetchSudokus(); // 刷新列表
    } catch (error) {
      message.error('删除失败，请重试');
    }
  };

  // 查看数独详情
  const handleView = (record: SudokuItem) => {
    setSelectedSudoku(record);
    setVisible(true);
  };

  // 关闭 Modal
  const handleClose = () => {
    setVisible(false);
    setSelectedSudoku(null);
  };

  // 渲染数独网格
  const renderSudokuGrid = (jsonString: string) => {
    try {
      const board: string[][] = JSON.parse(jsonString);
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(9, 40px)',
            gap: '5px',
            marginTop: '10px',
          }}
        >
          {board.map((row, rowIndex) =>
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
      );
    } catch (error) {
      return <span>解析数独数据失败</span>;
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '初始面板（题目面板）',
      dataIndex: 'initial_board',
      key: 'initial_board',
      render: (text: string) => <span>{text.slice(0, 20)}...</span>, // 截断显示，避免太长
    },
    {
      title: '答案面板',
      dataIndex: 'solution',
      key: 'solution',
      render: (text: string) => <span>{text.slice(0, 20)}...</span>,
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: SudokuItem) => (
        <>
          <Button type="link" onClick={() => handleView(record)}>
            查看
          </Button>
          <Popconfirm
            title="确定删除这个数独题目吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={fetchSudokus}>刷新页面</Button>
      </div>

      <Table columns={columns} dataSource={sudokus} rowKey="id" />

      <Modal
        title="数独详情"
        visible={visible}
        onCancel={handleClose}
        footer={[
          <Button key="close" onClick={handleClose}>
            关闭
          </Button>,
        ]}
      >
        {selectedSudoku && (
          <div>
            <h3>题目面板</h3>
            {renderSudokuGrid(selectedSudoku.initial_board)}
            <h3 style={{ marginTop: '20px' }}>答案面板</h3>
            {renderSudokuGrid(selectedSudoku.solution)}
            <p style={{ marginTop: '20px' }}>难度: {selectedSudoku.difficulty}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SudokuManage;
