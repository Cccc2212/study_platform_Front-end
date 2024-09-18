import { PageContainer } from '@ant-design/pro-components';
import { Alert, Card, Typography } from 'antd';
import React from 'react';
import styles from './Welcome.less';
import { GITHUB_LINK } from '@/constants';
import { GithubOutlined } from '@ant-design/icons'; 

const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);
const Welcome: React.FC = () => {
  return (
    <PageContainer>
      <Card>
        <Alert
          message={'功能暂未开发，敬请期待'}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <Typography.Text strong>
          <a href={GITHUB_LINK} rel="noopener noreferrer" target="__blank">
            <GithubOutlined />作者GITHUB ，欢迎批评与指导:)
          </a>
        </Typography.Text>
        <CodePreview>{GITHUB_LINK}</CodePreview>
        <Typography.Text strong>
          <a
            href="https://procomponents.ant.design/components/table"
            rel="noopener noreferrer"
            target="__blank"
          >
            前往ant-component翻阅文件:)
          </a>
        </Typography.Text>
        <CodePreview>https://procomponents.ant.design/components/table</CodePreview>
        <Typography.Text strong>
          <a
            href="https://www.csdn.net/"
            rel="noopener noreferrer"
            target="__blank"
          >
            前往CSDN翻阅文件:)
          </a>
        </Typography.Text>
        <CodePreview>https://www.csdn.net/</CodePreview>
        <Typography.Text strong>
          <a
            href="https://umijs.org/docs/guides/getting-started"
            rel="noopener noreferrer"
            target="__blank"
          >
            前往UMI翻阅文件:)
          </a>
        </Typography.Text>
        <CodePreview>https://umijs.org/docs/guides/getting-started</CodePreview>

      </Card>
    </PageContainer>
  );
};
export default Welcome;
