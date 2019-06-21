<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="hasVerifyCode ? loginRulesHasVerifyCode : loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">{{ $t('login.title') }}</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          :placeholder="$t('login.username')"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          :placeholder="$t('login.password')"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item v-if="hasVerifyCode" prop="verifyCode">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="verifyCode"
          v-model.trim="loginForm.verifyCode"
          class="verify-code-input"
          :placeholder="$t('login.verifyCode')"
          name="verifyCode"
          tabindex="3"
          auto-complete="on"
          @keyup.native.enter="handleLogin"
        />
        <img class="verify-code-img" :src="verifyCodeImg" width="100" height="43" @click="updateVerifyCode">
      </el-form-item>

      <el-button :loading="loading" :disabled="loginIsDisabled" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">{{ $t('login.logIn') }}</el-button>
      <div class="forgot-password">
        <router-link to="/retrieve-pass">
          {{ $t('login.forgotPassword') }}
        </router-link>
      </div>
      <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: 1234qwer</span>
      </div>
      <div class="tips">
        <span style="margin-right:20px;">username: admin2</span>
        <span> password: 1234qwer</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { encrypt } from '@/utils'
import axios from 'axios'

export default {
  name: 'Login',
  data() {
    const usernamePattern = /^[a-zA-Z0-9]{3,15}$/
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validate.username')))
      } else if (!usernamePattern.test(value)) {
        callback(new Error(this.$t('validate.username2')))
      } else {
        callback()
      }
    }

    const passwordPattern = /^[a-zA-Z0-9]{6,20}$/
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validate.password')))
      } else if (!passwordPattern.test(value)) {
        callback(new Error(this.$t('validate.password2')))
      } else {
        callback()
      }
    }

    const verifyCodePattern = /^[a-zA-Z0-9]{4}$/
    const validateVerifyCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validate.verifyCode')))
      } else if (!verifyCodePattern.test(value)) {
        callback(new Error(this.$t('validate.verifyCode2')))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: 'admin',
        password: '1234qwer',
        verifyCode: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loginRulesHasVerifyCode: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        verifyCode: [{ required: true, trigger: 'blur', validator: validateVerifyCode }]
      },
      hasVerifyCode: false,
      verifyCodeImg: '',
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  computed: {
    loginIsDisabled: function() {
      return this.hasVerifyCode ? (this.loginForm.username === '' || this.loginForm.password === '' || this.loginForm.verifyCode === '') : (this.loginForm.username === '' || this.loginForm.password === '')
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    if (this.hasVerifyCode) {
      this.updateVerifyCode()
    }
  },
  methods: {
    updateVerifyCode() {
      axios
        .get(`${process.env.VUE_APP_BASE_API}/v1/captcha/request?type=LOGIN&ts=${+new Date()}`, {
          responseType: 'arraybuffer'
        })
        .then(response => {
          return 'data:image/png;base64,' + btoa(
            new Uint8Array(response.data)
              .reduce((data, byte) => data + String.fromCharCode(byte), '')
          )
        }).then(data => {
          document.querySelector('.verify-code-img').src = data
        })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const params = Object.assign({}, this.loginForm)
          params.password = encrypt(params.password)
          this.loading = true
          this.$store.dispatch('user/login', params).then((res) => {
            this.loading = false
            this.hasVerifyCode = false
            if (!res.passwordChangeStatus) {
              this.$router.push({ path: '/init-pass' })
            } else {
              this.$router.push({ path: this.redirect || '/' })
            }
          }).catch((error) => {
            this.loading = false
            if (error.code === 6000 || error.code === 6001) {
              this.hasVerifyCode = true
              this.updateVerifyCode()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .verify-code-input {
    width: calc(100% - 148px)
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .forgot-password {
    font-size: 14px;
    margin-bottom: 10px;
    a {
      color: #409EFF;
      &:hover {
        color: #66b1ff;
      }
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .verify-code-img {
    vertical-align: middle;
    cursor: pointer;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
