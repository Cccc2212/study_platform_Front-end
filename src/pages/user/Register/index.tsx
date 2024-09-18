import Footer from '@/components/Footer';
import { register } from '@/services/ant-design-pro/api';
import { GithubOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message, Space, Tabs } from 'antd';
import React, { useState } from 'react';
import { history, Link } from 'umi';
import styles from './index.less';
import { GITHUB_LINK, SYSTEM_LOGO } from '@/constants';

const Register: React.FC = () => {
  const [type, setType] = useState<string>('account');
  // 表单提交
  const handleSubmit = async (values: API.RegisterParams) => {
    const { userPassword, checkPassword } = values;
    // 校验
    if (userPassword !== checkPassword) {
      message.error('两次输入的密码不一致:(');
      return;
    }
    try {
      // 注册
      const id = await register(values);
      if (id) {
        const defaultLoginSuccessMessage = '注册成功！';
        message.success(defaultLoginSuccessMessage);
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        history.push({
          pathname: '/user/login',
          query,
        });
        return;
      }
    } catch (error) {
      const defaultLoginFailureMessage = '注册失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm //ant design封装的component封装的太死了，要一步一步往源文件挖把loginForm的内容更改
          submitter={{
            searchConfig: {
              submitText: '注册',
            },
          }}
          logo={<img alt="logo" src={SYSTEM_LOGO} />}
          title="Chrisの用户学习中心"
          subTitle={
            <a href={GITHUB_LINK} target={'_b lank'} rel="noreferrer">
              <GithubOutlined />
              关注我谢谢
            </a>
          }
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane key="account" tab={'账号密码——注册'} />
          </Tabs>
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入用户名:)'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项:)',
                  },
                  {
                    max: 10,
                    type: 'string',
                    message: '用户名最多10位:)',
                  },
                ]}
              />
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入账号:)'}
                rules={[
                  {
                    required: true,
                    message: '账号是必填项:)',
                  },
                  {
                    min: 4,
                    type: 'string',
                    message: '账号至少4位:)',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入密码:)'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项:)',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '密码至少8位:)',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请再次输入密码:)'}
                rules={[
                  {
                    required: true,
                    message: '确认密码是必填项:)',
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '密码至少8位:)',
                  },
                ]}
              />
              <ProFormText
                name="platformCode"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'请输入平台编号:)'}
                rules={[
                  {
                    required: true,
                    message: '平台编号是必填项:)',
                  },
                  {
                    max: 5,
                    type: 'string',
                    message: '平台编号最多5位:)',
                  },
                ]}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <Space>
              <Link to="/user/login"> 返回用户登录:) </Link>
            </Space>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Register;
