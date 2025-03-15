// @ts-ignore
/* eslint-disable */
import request from '@/plugins/globalRequest';
import {message} from 'antd';

/**
 * 用户操作区
 */

/** 获取当前的用户 GET /api/user/current */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.CurrentUser>>('/api/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/user/logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request<API.BaseResponse<number>>('/api/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/user/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.LoginResult>>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 注册接口 POST  /api/user/register */
export async function register(body: API.RegisterParams, options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.RegisterResult>>('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 管理员搜索用户 GET /api/user/search */
export async function searchUsers(options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.CurrentUser[]>>('/api/user/search', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 搜索用户 GET /api/user/searchcommon */
export async function searchUsersCommon(options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.CurrentUser[]>>('/api/user/searchcommon', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 删除用户 POST /api/user/delete */
export async function deleteUser(body: API.DeleteParams, options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.DeleteParams>>('/api/user/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新用户 POST /api/user/update */
export async function updateUser(body: API.UpdateParams, options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.UpdateParams>>('/api/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**
 * 导航操作区
 */

/** 删除导航 POST /api/user/delete_nav */
export async function deleteNav(body: API.DeleteParamsNav, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/api/user/delete_nav', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 搜索导航 GET /api/user/search_nav */
export async function searchNavs(options?: { [key: string]: any }) {
  return request<API.BaseResponse<API.NavParams[]>>('/api/user/search_nav', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建导航接口 POST  /api/user/create_nav */
export async function createNav(body: API.NavParams, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/api/user/create_nav', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新导航 POST /api/user/update_nav */
export async function updateNav(body: API.NavParams, options?: { [key: string]: any }) {
  return request<API.BaseResponse<boolean>>('/api/user/update_nav', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/**
 * 数独操作区
 */

/** 获取随机数独题目 GET /api/sudoku/getRandomPuzzle */
// export async function getRandomPuzzle(options?: { [key: string]: any }) {
//   return request<API.BaseResponse<API.SudokuParams>>('/api/sudoku/getRandomPuzzle', {
//     method: 'GET',
//     ...(options || {}),
//   });
// }
// api.ts
export const getRandomPuzzle = async () => {
  try {
    const response = await fetch('/api/sudoku/getRandomPuzzle');
    if (!response.ok) {
      throw new Error(`HTTP 错误! 状态: ${response.status}`);
    }
    const data = await response.json();
    console.log('获取的数独数据:', data);
    return data;
  } catch (error) {
    console.error('获取数独题目失败:', error);
    throw error;
  }
};

/**
 * 获取随机数独题目（按难度）
 * GET /sudoku/getRandomPuzzleByDifficulty
 */
export async function getRandomPuzzleByDifficulty(options?: { difficulty?: number }) {
  const params = options?.difficulty ? {difficulty: options.difficulty} : {};
  try {
    const response = await request<any>('/api/sudoku/getRandomPuzzleByDifficulty', {
      method: 'GET',
      params,
    });
    console.log('获取的数独数据:', response);
    return response;
  } catch (error) {
    console.error('获取数独题目失败1:', error);
    message.error((error as Error).message || '获取数独题目失败2');
    throw error;
  }
}

/**
 *  保存数独题目
 *  POST  /sudoku/savePuzzle
 */
export async function saveSudokuPuzzle(puzzle: { initial_board: string; solution: string; difficulty: number }) {
  try {
    const response = await request<any>(
      '/api/sudoku/savePuzzle',
      {
        method: 'POST',
        data: puzzle,
      }
    );
    if (response) {
      return response;
    } else {
      throw new Error(response.msg || '保存失败');
    }
  } catch (error) {
    console.error('保存数独失败:', error);
    message.error((error as Error).message || '保存失败111');
    throw error;
  }
}
// /** 此处后端没有提供注释 GET /api/notices */
// export async function getNotices(options?: { [key: string]: any }) {
//   return request<API.NoticeIconList>('/api/notices', {
//     method: 'GET',
//     ...(options || {}),
//   });
// }

// /** 获取规则列表 GET /api/rule */
// export async function rule(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     /** 页面的容量 */
//     pageSize?: number;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>('/api/rule', {
//     method: 'GET',
//     params: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }

// /** 新建规则 PUT /api/rule */
// export async function updateRule(options?: { [key: string]: any }) {
//   return request<API.RuleListItem>('/api/rule', {
//     method: 'PUT',
//     ...(options || {}),
//   });
// }
//
// /** 新建规则 POST /api/rule */
// export async function addRule(options?: { [key: string]: any }) {
//   return request<API.RuleListItem>('/api/rule', {
//     method: 'POST',
//     ...(options || {}),
//   });
// }
//
// /** 删除规则 DELETE /api/rule */
// export async function removeRule(options?: { [key: string]: any }) {
//   return request<Record<string, any>>('/api/rule', {
//     method: 'DELETE',
//     ...(options || {}),
//   });
// }
