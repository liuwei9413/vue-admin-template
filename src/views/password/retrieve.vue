<template>
  <div class="app-container">
    <el-form v-if="stepStaus === 1" ref="form1Ref" class="form-container" :model="form1Model" :rules="form1Rule">
      <div class="title-container">
        <h3 class="title">{{ $t('retrievePassword.title') }}</h3>
      </div>
      <div class="step-container">
        <h4 class="step">Step 1. {{ $t('retrievePassword.step1') }}</h4>
      </div>
      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="form1Model.username"
          :placeholder="$t('retrievePassword.usernamePlaceholder')"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="verifyCode">
        <el-input
          ref="verifyCode"
          v-model.trim="form1Model.verifyCode"
          class="verify-code-input"
          :placeholder="$t('retrievePassword.verifyCodePlaceholder')"
          name="verifyCode"
          tabindex="2"
          auto-complete="on"
          @keyup.native.enter="submitForm1('form1Ref')"
        />
        <img class="verify-code-img" :src="verifyCodeImg" width="100" height="40" @click="updateVerifyCode">
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click="submitForm1('form1Ref')">{{ $t('retrievePassword.nextButton') }}</el-button>
      </el-form-item>
    </el-form>
    <el-form v-if="stepStaus === 2" ref="form2Ref" class="form-container" :model="form2Model" :rules="form2Rule">
      <div class="title-container">
        <h3 class="title">{{ $t('retrievePassword.title') }}</h3>
      </div>
      <div class="step-container">
        <h4 class="step">Step 2. {{ $t('retrievePassword.step2') }}</h4>
      </div>
      <p>{{ $t('retrievePassword.emailText') }}</p>
      <el-form-item prop="emailCode">
        <el-input
          ref="emailCode"
          v-model="form2Model.emailCode"
          :placeholder="$t('retrievePassword.emailCodePlaceholder')"
          name="emailCode"
          type="text"
          tabindex="1"
          auto-complete="on"
          @keyup.native.enter="submitForm2('form2Ref')"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click="submitForm2('form2Ref')">{{ $t('retrievePassword.nextButton') }}</el-button>
      </el-form-item>
    </el-form>
    <el-form v-if="stepStaus === 3" ref="form3Ref" class="form-container" :model="form3Model" :rules="form3Rule">
      <div class="title-container">
        <h3 class="title">{{ $t('retrievePassword.title') }}</h3>
      </div>
      <div class="step-container">
        <h4 class="step">Step 3. {{ $t('retrievePassword.step3') }}</h4>
      </div>
      <el-form-item prop="newPassword">
        <el-input
          v-model="form3Model.newPassword"
          :placeholder="$t('retrievePassword.newPasswordPlaceholder')"
          name="newPassword"
          type="password"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item prop="checkPassword">
        <el-input
          v-model="form3Model.checkPassword"
          :placeholder="$t('retrievePassword.checkPasswordPlaceholder')"
          name="checkPassword"
          type="password"
          tabindex="2"
          auto-complete="on"
          @keyup.native.enter="submitForm3('form3Ref')"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" :loading="loading" @click="submitForm3('form3Ref')">{{ $t('retrievePassword.ensureButton') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import { encrypt } from '@/utils'
import { checkAccount, checkEmailCode, newPassword } from '@/api/user'

export default {
  components: {
  },
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

    const emailCodePattern = /^\d{6}$/
    const validateEmailCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validate.emailCode')))
      } else if (!emailCodePattern.test(value)) {
        callback(new Error(this.$t('validate.emailCode2')))
      } else {
        callback()
      }
    }

    const passwordPattern = /^[a-zA-Z0-9]{6,20}$/
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validate.password3')))
      } else if (!passwordPattern.test(value)) {
        callback(new Error(this.$t('validate.password2')))
      } else {
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validate.password3')))
      } else if (!passwordPattern.test(value)) {
        callback(new Error(this.$t('validate.password2')))
      } else if (value !== this.form3Model.newPassword) {
        callback(new Error(this.$t('validate.password4')))
      } else {
        callback()
      }
    }

    return {
      stepStaus: 1,
      form1Model: {
        username: '',
        verifyCode: ''
      },
      verifyCodeImg: '',
      form1Rule: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        verifyCode: [{ required: true, trigger: 'blur', validator: validateVerifyCode }]
      },
      uuid: undefined,
      form2Model: {
        emailCode: '000000'
      },
      form2Rule: {
        emailCode: [{ required: true, trigger: 'blur', validator: validateEmailCode }]
      },
      form3Model: {
        newPassword: '',
        checkPassword: ''
      },
      form3Rule: {
        newPassword: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validatePassword2, trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  created() {
  },
  mounted() {
    this.updateVerifyCode()
  },
  methods: {
    updateVerifyCode() {
      axios
        .get(`${process.env.VUE_APP_BASE_API}/v1/captcha/request?type=FIND_PASSWORD&ts=${+new Date()}`, {
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
    submitForm1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          checkAccount(this.form1Model)
            .then((res) => {
              this.loading = false
              this.uuid = res.data.uuid
              this.$refs[formName].resetFields()
              this.$message.success('successful')

              this.stepStaus = 2
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    submitForm2(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true

          checkEmailCode({ uuid: this.uuid }, { mailCode: this.form2Model.emailCode })
            .then((res) => {
              this.loading = false
              this.uuid = res.data.uuid
              this.$refs[formName].resetFields()
              this.$message.success('successful')

              this.stepStaus = 3
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    submitForm3(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const params = {
            newPassword: encrypt(this.form3Model.newPassword)
          }

          newPassword({ uuid: this.uuid }, params)
            .then((res) => {
              this.loading = false
              this.$refs[formName].resetFields()
              this.$message.success('successful')

              this.$router.push({ path: '/login' })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .app-container {
    position: relative;
    width: 520px;
    margin: 0 auto 0;
    .form-container {
      margin-top: 100px;
      .title-container {
        position: relative;
        .title {
          font-size: 26px;
          margin: 0px auto 40px auto;
          text-align: center;
          font-weight: bold;
        }
      }
      .step-container {
        .step {
          font-size: 16px;
        }
      }

      .verify-code-input {
        display: inline-block;
        margin-right: 5px;
        vertical-align: middle;
        width: 370px;
      }

      .verify-code-img {
        vertical-align: middle;
        cursor: pointer;
      }
    }
  }
</style>
