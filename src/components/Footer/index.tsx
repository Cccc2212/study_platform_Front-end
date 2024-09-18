import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import {GITHUB_LINK} from "@/constants";

const Footer: React.FC = () => {
  const defaultMessage = '林嘉曦出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'CSDN',
          title: 'CSDN跳转',
          href: 'https://www.csdn.net/',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <><GithubOutlined />chrisGitHub</>,
          href: GITHUB_LINK,
          blankTarget: true,
        },
        {
          key: 'chatGPT',
          title: 'ChatGPT跳转',
          href: 'https://chatgpt.com/',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
