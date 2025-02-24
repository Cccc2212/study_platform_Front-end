export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './user/Login' },
      { name: '注册', path: '/user/register', component: './user/Register' },
      { component: './404' },
    ],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  { name: '导航页', icon: 'Twitter', path: '/nav', component: './Nav' },
  { name: '做题页', icon: 'Book', path: '/exam', component: './Exam' },

  { name: '查询页', icon: 'phone', path: '/list', component: './TableList' },
  { name: '数独页', icon: 'star', path: '/sudoku', component: './Sudoku' },
  { name: '2048游戏页', icon: 'number', path: '/game2048', component: './Game2048' },

  {
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      { path: '/admin/user-manage', name: '用户管理', component: './Admin/UserManage' },
      { path: '/admin/user-nav', name: '导航管理', component: './Admin/NavManage' },
      { component: './404' },
    ],
  },

  { path: '/', redirect: '/welcome' },
  { component: './404' },
];
