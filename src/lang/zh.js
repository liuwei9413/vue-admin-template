export default {
  route: {
    signature: '签名管理',
    signatureDashboard: '签名概览',
    signatureHistory: '签名历史记录',
    certificateManagement: '证书管理',
    updatePassword: '修改密码',
    message: '消息中心',
    userManage: '用户管理',
    userList: '用户列表',
    createUser: '新增用户',
    editUser: '修改用户信息'
  },
  password: {
    title: '修改密码',
    label1: '旧密码：',
    placeholder1: '请输入旧密码',
    label2: '新密码：',
    placeholder2: '请输入新密码',
    label3: '确认密码：',
    placeholder3: '请再次输入新密码',
    button: '确定',
    toast: '密码修改成功'
  },
  retrievePassword: {
    title: '找回密码',
    step1: '确认账户',
    step2: '安全验证',
    step3: '重置密码',
    usernamePlaceholder: '请输入用户名',
    verifyCodePlaceholder: '请输入验证码',
    checkAccountToast: '用户名无效，请确认您输入的用户名是否正确',
    emailCodePlaceholder: '请输入安全码',
    newPasswordPlaceholder: '请输入新密码',
    checkPasswordPlaceholder: '请再次输入新密码',
    nextButton: '下一步',
    ensureButton: '确定',
    emailText: '我们向您的邮箱发放了一封带有安全码的邮件。'
  },
  navbar: {
    updatePassword: '修改密码',
    message: '消息中心',
    logOut: '退出登录'
  },
  login: {
    title: '系统登录',
    logIn: '登录',
    username: '账号',
    password: '密码',
    verifyCode: '验证码',
    forgotPassword: '忘记密码'
  },
  user: {
    createUserButton: '新增用户',
    placeholder: '请输入'
  },
  validate: {
    username: '用户名不能为空',
    username2: '用户名必须为3-15位的英文字母或数字',
    password: '密码不能为空',
    password2: '密码必须为6-20位的英文字母或数字',
    password3: '新密码不能为空',
    password4: '两次输入的新密码不一致',
    verifyCode: '验证码不能为空',
    verifyCode2: '验证码必须为4位的英文字母或数字',
    emailCode: '安全码不能为空',
    emailCode2: '安全码必须为6位的数字'
  },
  error: {
    parameterNull: '参数为空',
    parameterIllegal: '参数非法',
    userLogout: '用户未登录',
    userUndefined: '用户不存在',
    userDisabled: '用户已禁用',
    usernameOrPasswordError: '账号或密码错误',
    originPasswordError: '原始密码错误',
    verifyCodeNull: '图片验证码为空',
    verifyCodeError: '图片验证码错误',
    systemException: '系统异常,稍后再试',
    netException: '网络不好，请稍后重试'
  }
}
