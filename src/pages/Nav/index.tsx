import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import {
  BookOutlined,
  ScheduleOutlined,
  BilibiliOutlined,
  CrownOutlined,
  BellOutlined,
  YuqueOutlined
} from '@ant-design/icons';
import { searchNavs } from '@/services/ant-design-pro/api'; // 根据实际路径调整

const iconMap: Record<string, React.ReactNode> = {
  cainiao: <BookOutlined />,
  w3cSchool: <ScheduleOutlined />,
  bilibili: <BilibiliOutlined />,
  MOOC: <CrownOutlined />,
  CSDN: <BellOutlined />,
  yuque:<YuqueOutlined/>
};

const NavigationMenu: React.FC = () => {
  const [items, setItems] = useState<API.Nav[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchNavs = async () => {
      try {
        const response = await searchNavs();
        console.log('完整 API response:', response); // 打印 response

        // 假设 response 是数组，直接使用
        if (Array.isArray(response)) {
          setItems(response); // 设置导航项
        } else {
          console.error('获取导航数据失败: 预期是数组，但收到的格式不正确');
        }
      } catch (error) {
        console.error('获取导航数据时出错:', error);
      }
    };
    fetchNavs();
  }, []);

  const handleClick = (click: any) => {
    const selectedItem = items.find((item) => item.navKey === click.key);
    if (selectedItem?.url) {
      setSelectedUrl(selectedItem.url);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Menu
        mode="vertical"
        onClick={handleClick}
        items={items.map(({ label, navKey }) => ({
          label: (
            <div className="menu-item">
              <span className="menu-item-left">
                {iconMap[navKey] || <BookOutlined />}
                {label}
              </span>
            </div>
          ),
          key: navKey,
          title: '', // 如果需要使用描述信息，请在这里更新
        }))}
      />
      <div style={{ flex: 1 }}>
        {selectedUrl ? (
          <iframe
            src={selectedUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="content"
            onError={() => alert('该网站无法加载')}
          />
        ) : (
          <div style={{ textAlign: 'center', paddingTop: '100px' }}>
            点击一个网站进行访问
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationMenu;
