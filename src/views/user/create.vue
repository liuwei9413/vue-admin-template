<template>
  <div class="app-container" :loading="loading">
    <el-form ref="formRef" class="form-container" :model="formModel" :rules="formRule" label-width="200px">
      <el-form-item class="is-required" label="用户名" prop="username">
        <el-input
          ref="username"
          v-model="formModel.username"
          :placeholder="$t('user.placeholder')"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item class="is-required" label="初始密码" prop="password">
        <el-input
          ref="password"
          v-model="formModel.password"
          :placeholder="$t('user.placeholder')"
          name="password"
          type="password"
          tabindex="2"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item class="is-required" label="确认密码" prop="checkPassword">
        <el-input
          ref="checkPassword"
          v-model="formModel.checkPassword"
          :placeholder="$t('user.placeholder')"
          name="checkPassword"
          type="password"
          tabindex="3"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item class="is-required" label="联系邮箱" prop="email">
        <el-input
          ref="email"
          v-model="formModel.email"
          :placeholder="$t('user.placeholder')"
          name="email"
          type="text"
          tabindex="4"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item class="is-required" label="该用户角色" prop="role">
        <el-select
          ref="role"
          v-model="formModel.role"
          placeholder="请选择"
          name="role"
          tabindex="5"
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="is-required" label="Vekey对应的地址" prop="address">
        <el-input
          ref="address"
          v-model="formModel.address"
          :placeholder="$t('user.placeholder')"
          name="address"
          type="text"
          tabindex="6"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item class="is-required" label="Vekey对应的public key" prop="publicKey">
        <el-input
          ref="publicKey"
          v-model="formModel.publicKey"
          :placeholder="$t('user.placeholder')"
          name="publicKey"
          type="text"
          tabindex="7"
          auto-complete="on"
          @keyup.native.enter="submitForm('formRef')"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:50%;" @click="submitForm('formRef')">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { encrypt } from '@/utils'
import { createUser } from '@/api/user'
import { handleSign, recordSignature } from '@/utils/sign'

export default {
  name: 'CreateUser',
  components: { },
  data() {
    return {
      formModel: {
        username: 'karl',
        password: '1234qwer',
        checkPassword: '1234qwer',
        email: 'wei.liu@vechain.com',
        role: 'MANAGER',
        address: '0x772be59e4f5e0e838e32efdd721d41b1a82860a1',
        publicKey: '04f16c370b5f6808996d2e67243d94bc63ed7530dd361771e513286665aa1414e814913e8b5dc5cf753b250026827c921f1f043c93b89bd389b539c99e7bf54940'
      },
      formRule: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入VeKey生成的地址', trigger: 'blur' }
        ],
        publicKey: [
          { required: true, message: '请输入public key', trigger: 'blur' }
        ]
      },
      roleOptions: [
        {
          label: '管理员',
          value: 'MANAGER'
        },
        {
          label: '操作员',
          value: 'OPERATOR'
        },
        {
          label: '审核员',
          value: 'ASSESSOR'
        }
      ],
      recordId: '',
      signatureType: 'APPLY',
      loading: false
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = Object.assign({}, this.formModel, { password: encrypt(this.formModel.password) })
          delete params.checkPassword

          this.handleCreateUser(params)
        } else {
          return false
        }
      })
    },
    async handleCreateUser(params) {
      try {
        this.loading = true
        const signInfoRes = await createUser(params)
        // this.$refs[formName].resetFields()
        this.$message.success('获取待签名信息成功，待签名...' || signInfoRes.message)
        const signInfo = signInfoRes.data.needSignedInfo
        this.recordId = signInfoRes.data.recordId

        // Sign by vekey
        const signatureRes = await handleSign(signInfo)
        const signature = signatureRes.data && signatureRes.data.signature

        // Record the signature
        this.handleSignature({ recordId: this.recordId }, { signature: signature, signatureType: this.signatureType })
      } catch (error) {
        this.loading = false
      }
    },
    handleSignature(path, body) {
      recordSignature(path, body)
        .then(() => {
          this.loading = false
          this.$alert('等待审核员审核！', '操作成功', {
            confirmButtonText: '好的',
            callback: action => {
              this.$router.push({ path: '/user/list' })
            }
          })
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    padding: 50px 30px;
    width: 60%;
  }
</style>
