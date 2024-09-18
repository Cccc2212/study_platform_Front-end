import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import { searchNavs, createNav, updateNav, deleteNav } from '@/services/ant-design-pro/api';

interface NavItem {
  id: number;
  label: string;
  navKey: string;
  url: string;
}

const NavManage: React.FC = () => {
  const [navs, setNavs] = useState<NavItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNav, setCurrentNav] = useState<NavItem | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 获取导航数据
  const fetchNavs = async () => {
    try {
      const response = await searchNavs();
      if (Array.isArray(response)) {
        setNavs(response);
      } else {
        message.error('获取导航数据失败');
      }
    } catch (error) {
      message.error('加载导航数据时出错');
    }
  };

  useEffect(() => {
    fetchNavs();
  }, []);

  // 打开模态框，传入当前的导航项，如果是新建，则传null
  const openModal = (nav?: NavItem) => {
    setIsModalOpen(true);
    setCurrentNav(nav || null);
    form.setFieldsValue(nav || { label: '', navKey: '', url: '' });
  };

  // 关闭模态框
  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // 表单提交 - 创建或更新导航
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (currentNav) {
        // 更新导航
        await updateNav({ ...currentNav, ...values });
        message.success('更新成功');
      } else {
        // 创建导航
        await createNav(values);
        message.success('创建成功');
      }
      closeModal();
      fetchNavs(); // 刷新导航列表
    } catch (error) {
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 删除导航
  const handleDelete = async (navKey: string) => {
    try {
      await deleteNav({ navKey });
      message.success('删除成功');
      fetchNavs(); // 刷新导航列表
    } catch (error) {
      message.error('删除失败，请重试');
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '名称',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'navKey',
      dataIndex: 'navKey',
      key: 'navKey',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: NavItem) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除这条导航吗？"
            onConfirm={() => handleDelete(record.navKey)}
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
        <Button type="primary" onClick={() => openModal()} style={{ marginRight: 8 }}>
          新建导航
        </Button>
        {/* 第一个刷新按钮 */}
        <Button onClick={fetchNavs}>
          刷新页面
        </Button>
      </div>

      <Table columns={columns} dataSource={navs} rowKey="id" />



      <Modal
        title={currentNav ? '编辑导航' : '新建导航'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={closeModal}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="名称" name="label" rules={[{ required: true, message: '请输入导航名称',min:1 }]}>
            <Input />
          </Form.Item>
          <Form.Item label="navKey" name="navKey" rules={[{ required: true, message: '请输入导航 navKey',min:1 }]}>
            <Input />
          </Form.Item>
          <Form.Item label="URL" name="url" rules={[{ required: true, message: '请输入 URL',min:1 }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NavManage;
