import {GithubOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import { Space } from 'antd';
import React from 'react';
import { useModel } from 'umi';
import HeaderSearch from '../HeaderSearch';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import {GITHUB_LINK} from "@/constants";
export type SiderTheme = 'light' | 'dark';
const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  if (!initialState || !initialState.settings) {
    return null;
  }
  const { navTheme, layout } = initialState.settings;
  let className = styles.right;
  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="场外支援"
        defaultValue=""
        options={[
          {
            label: <a href="https://umijs.org/docs/guides/getting-started">umi ui</a>,
            value: 'umi ui',
          },
          {
            label: <a href="https://pro.ant.design/docs/getting-started/">Ant Design PRO</a>,
            value: 'Ant Design Pro',
          },
          {
            label: <a href="https://procomponents.ant.design/components/table">Ant Components</a>,
            value: 'Ant Components',
          },
          {
            label: <a href="https://www.google.com/">Google</a>,
            value: 'Google',
          },
          {
            label: <a href="https://www.csdn.net/">CSDN</a>,
            value: 'CSDN',
          },
        ]}
        onSearch={value => {
          console.log('input', value);
        }}
      />
      <span
        className={styles.action}
        onClick={() => {
          window.open(GITHUB_LINK);
        }}
      >
        <GithubOutlined />
      </span>
      <span
        className={styles.action}
        onClick={() => {
          window.open("https://en.wiktionary.org/wiki/question_mark");
        }}
      >
        <QuestionCircleOutlined/>
      </span>
      <Avatar/>
    </Space>
  );
};
export default GlobalHeaderRight;
