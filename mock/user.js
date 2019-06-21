
// const tokens = {
//   admin: {
//     token: 'admin-token'
//   },
//   editor: {
//     token: 'editor-token'
//   }
// }

// const users = {
//   'admin': {
//     roles: ['admin'],
//     introduction: 'I am a super administrator',
//     avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
//     name: 'Super Admin'
//   },
//   'operator': {
//     roles: ['operator'],
//     introduction: 'I am an operator',
//     avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
//     name: 'Normal operator'
//   },
//   'assessor': {
//     roles: ['assessor'],
//     introduction: 'I am an assessor',
//     avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
//     name: 'Normal assessor'
//   }
// }

export default [
  // user login
  {
    url: '/v1/auth/login',
    type: 'post',
    response: config => {
      // const { username } = config.body
      // const token = tokens[username]

      // mock error
      // if (!token) {
      //   return {
      //     code: 60204,
      //     message: 'Account and password are incorrect.'
      //   }
      // }

      return {
        code: 1,
        // data: token
        data: {
          loginId: 'e10adc3949ba59abbe56e057f20f883e'
        }
      }
    }
  },

  // get user info
  {
    url: '/v1/user/info\.*',
    type: 'get',
    response: config => {
      // const { token } = config.query
      // const info = users[token]

      // mock error
      // if (!info) {
      //   return {
      //     code: 50008,
      //     message: 'Login failed, unable to get user details.'
      //   }
      // }

      return {
        code: 200,
        data: {
          roles: ['MANAGER'],
          introduction: 'I am a super administrator',
          avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
          name: 'Super Admin'
        }
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        data: 'success'
      }
    }
  }
]
