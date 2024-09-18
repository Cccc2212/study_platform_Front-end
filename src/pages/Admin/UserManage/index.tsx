import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { useRef } from 'react';
import { deleteUser, searchUsers, updateUser } from '@/services/ant-design-pro/api';
import { Image, message, Modal } from 'antd';

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
    title: '状态',
    dataIndex: 'userStatus',
    valueEnum: {
      //status里面的default和success和error代表的是颜色，灰绿红
      0: { text: '正常' },
      1: { text: '异常', status: 'error' },
    },
  },

  {
    title: '平台编号',
    dataIndex: 'platformCode',
  },
  {
    title: '角色',
    dataIndex: 'userRole',
    valueType: 'select',
    valueEnum: {
      //status里面的default和success和error代表的是颜色，灰绿红
      0: { text: '普通用户', status: 'Default' },
      1: {
        text: '管理员',
        status: 'Success',
      },
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateTime',
    ellipsis: true, //是否允许缩写
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    valueType: 'dateTime',
    ellipsis: true, //是否允许缩写
  },

  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id); //启用编辑
        }}
      >
        编辑
      </a>,
      <TableDropdown
        key="actionGroup"
        menus={[
          { key: 'delete', name: '删除' },
          { key: 'nth', name: '（待开发）' },
        ]}
        onSelect={async (key) => {
          if (key === 'delete') {
            Modal.confirm({
              title: '确认删除',
              content: `确定要删除用户 ${record.username} 吗？`,
              okText: '确认',
              cancelText: '取消',
              async onOk() {
                const hide = message.loading('正在删除...');
                try {
                  const params = { userAccount: record.userAccount }; // 使用用户账号删除
                  const success = await deleteUser(params);
                  hide();
                  if (success) {
                    message.success('删除成功');
                    action?.reload();
                  } else {
                    throw new Error('删除失败');
                    action?.reload();
                  }
                } catch (error) {
                  message.error('删除失败，请重试');
                  action?.reload();
                }
              },
            });
          }
        }}
      />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        console.log(sort, filter);
        const userList = await searchUsers();
        return {
          data: userList,
        };
      }}
      editable={{
        type: 'multiple',
        // 更新用户信息
        onSave: async (_, data: API.UpdateParams) => {
          try {
            // 调用 updateUser API 并传递符合 UpdateParams 类型的 data
            const response: API.BaseResponse<API.UpdateParams> = await updateUser(data);
            if (response) {
              message.success('更新成功',response.code);
              actionRef.current?.reload();
            }else actionRef.current?.reload();
          } catch (error) {
            message.error('更新失败，请重试');
            actionRef.current?.reload();
          }
        },
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
      headerTitle="可修改"
    />
  );
};
