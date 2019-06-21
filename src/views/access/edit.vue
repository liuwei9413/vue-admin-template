<template>
  <div class="app-container" :loading="signLoading">
    <el-form ref="formRef" class="form-container" :model="formModel" :rules="formRule" label-width="200px">
      <el-form-item class="is-required" label="用户名" prop="username">
        <el-input
          ref="username"
          v-model="formModel.username"
          :placeholder="$t('user.placeholder')"
          name="username"
          type="text"
          auto-complete="on"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item class="is-required" label="联系邮箱" prop="email">
        <el-input
          ref="email"
          v-model="formModel.email"
          :placeholder="$t('user.placeholder')"
          name="email"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item class="is-required" label="该用户角色" prop="role">
        <el-select
          ref="role"
          v-model="formModel.role"
          placeholder="请选择"
          name="role"
          :disabled="true"
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
          tabindex="2"
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
          tabindex="3"
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
import { fetchUserInfo, updateUser } from '@/api/user'
import { handleSign, recordSignature } from '@/utils/sign'

export default {
  name: 'UpdateUser',
  components: { },
  data() {
    return {
      adminId: '',
      formModel: {
        username: '',
        email: '',
        role: '',
        address: '',
        publicKey: ''
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
      formRule: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
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
      recordId: '',
      signatureType: 'APPLY',
      infoLoading: false,
      signLoading: false
    }
  },
  computed: {
  },
  created() {
    this.adminId = this.$route.params && this.$route.params.id
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.infoLoading = true
      fetchUserInfo({ adminId: this.adminId })
        .then(res => {
          const dataRes = res.data
          for (const key in this.formModel) {
            this.formModel[key] = dataRes[key]
          }
          console.log(this.formModel)
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.signLoading = true
          const params = {
            email: this.formModel.email,
            address: this.formModel.address,
            publicKey: this.formModel.publicKey
          }
          this.handleUpdateUser({ adminId: this.adminId }, params)
        } else {
          return false
        }
      })
    },
    async handleUpdateUser(path, params) {
      const signInfoRes = await updateUser(path, params)
      this.$message.success('获取待签名信息成功，待签名...' || signInfoRes.message)
      const signInfo = signInfoRes.data.needSignedInfo
      this.recordId = signInfoRes.data.recordId

      // Sign by vekey
      const signatureRes = await handleSign(signInfo)
      const signature = signatureRes.data && signatureRes.data.signature

      // Record the signature
      this.handleSignature({ recordId: this.recordId }, { signature: signature, signatureType: this.signatureType })
    },
    handleSignature(path, body) {
      recordSignature(path, body)
        .then(() => {
          this.signLoading = false
          this.$alert('等待审核员审核！', '操作成功', {
            confirmButtonText: '好的',
            callback: action => {
              this.$router.push({ path: '/user/list' })
            }
          })
        })
        .catch(() => {
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
