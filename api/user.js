import API from './api';

const userApi = {
  getUserList: API('/list/user', 'get'),        // 用户展示

  usertypes: API('/update/type', 'post'), //修改用户类型

  userexport: API('/userexcel', 'get', false, true),//导出用户个人信息

  userIGN: API('/list/usersign', 'get'), //用户报名信息展示

  usersignexcel: API('/usersignexcel', 'get',false, true),//用户报名信息导出

  promotioninfoexcel: API('/promotioninfoexcel', 'get',false, true),//用户推广详细记录表

  promotionexcel: API('/promotionexcel', 'get','get',false, true)//用户推广统计表



}
export default userApi