import {searchUsersCommon} from '@/services/ant-design-pro/api';
import {ActionType, ProColumns, ProTable} from '@ant-design/pro-components';
import {Image} from 'antd';
import React, {useRef} from 'react';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'id',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    copyable: true, //是否允许复制
    ellipsis: true, //是否允许缩写
  },
  {
    title: '账户',
    dataIndex: 'userAccount',
    copyable: true, //是否允许复制
    ellipsis: true, //是否允许缩写
  },
  {
    title: '头像',
    dataIndex: 'avatarUrl',
    render: (_, record) => (
      <div>
        <Image src={record.avatarUrl} width={50} height={50} fallback={' '} />
      </div>
    ),
    copyable: true, //是否允许复制
  },
  {
    title: '性别',
    dataIndex: 'gender',
    valueEnum: {
      //status里面的default和success和error代表的是颜色，灰绿红
      0: { text: '男' },
      1: { text: '女' },
    },
  },
  {
    title: '电话',
    dataIndex: 'phone',
    copyable: true, //是否允许复制
    ellipsis: true, //是否允许缩写
  },
  {
    title: '邮件',
    dataIndex: 'email',
    ellipsis: true, //是否允许缩写
    copyable: true, //是否允许复制
  },
  {
    title: '平台编号',
    dataIndex: 'platformCode',
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      //拉数据库数据
      request={async (params, sort, filter) => {
        console.log(sort, filter);
        const userList = await searchUsersCommon();
        return {
          data: userList,
        };
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        defaultValue: {
          option: { fixed: 'right', disable: true },
        },
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          // listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="仅查看"
    />
  );
};
