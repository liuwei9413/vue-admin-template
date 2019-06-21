<template>
  <div class="app-container">
    <el-form ref="formRef" class="form-box" :model="formModel" :rules="rules" label-width="120px">
      <div class="title-container">
        <h3 class="title">{{ $t('password.title') }}</h3>
      </div>
      <el-form-item class="is-required" :label="$t('password.label1')" prop="oldPassword">
        <el-input v-model="formModel.oldPassword" type="password" :placeholder="$t('password.placeholder1')" />
      </el-form-item>
      <el-form-item class="is-required" :label="$t('password.label2')" prop="newPassword">
        <el-input v-model="formModel.newPassword" type="password" :placeholder="$t('password.placeholder2')" />
      </el-form-item>
      <el-form-item class="is-required" :label="$t('password.label3')" prop="checkPassword">
        <el-input v-model="formModel.checkPassword" type="password" :placeholder="$t('password.placeholder3')" @keyup.native.enter="submitForm('formRef')" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:50%;" :loading="loading" @click="submitForm('formRef')">{{ $t('password.button') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { encrypt } from '@/utils'

export default {
  components: {
  },
  data() {
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
    const validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validate.password3')))
      } else if (!passwordPattern.test(value)) {
        callback(new Error(this.$t('validate.password2')))
      } else if (value !== this.formModel.newPassword) {
        callback(new Error(this.$t('validate.password4')))
      } else {
        callback()
      }
    }

    return {
      formModel: {
        oldPassword: '',
        newPassword: '',
        checkPassword: ''
      },
      rules: {
        oldPassword: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        newPassword: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validatePassword2, trigger: 'blur' }
        ]
      },
      loading: false
      // redirect: undefined
    }
  },
  // watch: {
  //   $route: {
  //     handler: function(route) {
  //       this.redirect = route.query && route.query.redirect
  //     },
  //     immediate: true
  //   }
  // },
  created() {
  },
  mounted() {
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            oldPassword: encrypt(this.formModel.oldPassword),
            newPassword: encrypt(this.formModel.newPassword)
          }

          this.loading = true
          this.$store.dispatch('user/initPassword', params)
            .then(() => {
              this.loading = false
              this.$refs[formName].resetFields()

              this.$message({
                type: 'success',
                message: this.$t('password.toast')
              })
              // this.$router.push({ path: this.redirect || '/' })
              this.$router.push({ path: '/' })
              window.location.reload()
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
    width: 60%;
    margin: 50px auto 0;
    .title-container {
      position: relative;
      .title {
        font-size: 26px;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }
  }
</style>
