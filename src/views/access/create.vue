<template>
  <div class="app-container" :loading="loading">
    <div v-if="step === 1">
      <h3>上传证书</h3>
      <el-upload
        ref="upload"
        class="upload"
        action="/"
        drag
        :http-request="upload"
        :auto-upload="false"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传CA颁发的证书</div>
      </el-upload>
      <el-button style="margin-left: 10px;" type="primary" @click="submitUpload">下一步</el-button>
    </div>

    <el-form v-if="step === 2" ref="formRef" class="form-container" :model="formModel" :rules="formRule" label-width="200px">
      <el-form-item class="is-required" label="接入端名称" prop="accessName">
        <el-input
          ref="accessName"
          v-model="formModel.accessName"
          placeholder="请输入"
          name="accessName"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item class="is-required" label="接入端id" prop="accessId">
        <el-input
          ref="accessId"
          v-model="formModel.accessId"
          placeholder="请输入"
          name="accessId"
          type="text"
          auto-complete="on"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item class="is-required" label="联系人" prop="username">
        <el-input
          ref="username"
          v-model="formModel.username"
          placeholder="请输入"
          name="username"
          type="text"
          tabindex="2"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item class="is-required" label="联系方式" prop="email">
        <el-input
          ref="email"
          v-model="formModel.email"
          placeholder="请输入联系方式"
          name="email"
          type="text"
          tabindex="3"
          auto-complete="on"
        />
      </el-form-item>
      <el-form-item class="is-required" label="签名类型" prop="type">
        <el-select
          ref="type"
          v-model="formModel.type"
          placeholder="请选择"
          name="type"
          tabindex="4"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="contract-address" label="白名单地址">
        <div v-for="(item, index) in whiteListData" :key="index">
          <el-button v-show="index === 0" class="btn" type="primary" icon="el-icon-plus" @click="addWhiteLsit">添加</el-button>
          <el-button v-show="index !== 0" class="btn" type="primary" icon="el-icon-minus" @click="minusWhiteLsit(index)">删除</el-button>
          <el-input v-model.trim="item.value" style="margin-bottom: 10px;" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:50%;" @click="submitForm('formRef')">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createUser } from '@/api/user'
import { upload } from '@/api/access'
import { handleSign, recordSignature } from '@/utils/sign'

export default {
  name: 'CreateUser',
  components: { },
  data() {
    return {
      step: 2,
      certContent: '',
      // accessId: '',
      formModel: {
        accessName: '碳平台',
        accessId: '20d11fd949d28cb5fcc9cd882934f8e2332ebb09c76a5d8d86a3edb1cfa26a7f',
        username: 'tan1',
        email: 'wei.liu@vechain.com',
        type: 'hash',
        whiteList: []
      },
      formRule: {
        accessName: [
          { required: true, message: '请输入接入端名称', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择签名类型', trigger: 'blur' }
        ]
      },
      whiteListData: [{ value: '' }],
      typeOptions: [
        {
          label: '转账签名',
          value: 'transfer'
        },
        {
          label: 'Hash签名',
          value: 'hash'
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
    submitUpload() {
      this.$refs.upload.submit()
    },
    upload(param) {
      console.log(param)
      const isCert = param.file.type.indexOf('cert') >= 0
      if (!isCert) {
        this.$message.warning('请上传证书类型文件')
        return
      }
      const form = new FormData()
      form.append('file', param.file)
      upload(form)
        .then(res => {
          this.step = 2
          this.certContent = res.data.content
          this.formModel.accessId = res.data.appId
        })
        .catch(err => {
          console.error(err)
        })
    },
    addWhiteLsit() {
      this.whiteListData.push({ value: '' })
    },
    minusWhiteLsit(index) {
      this.whiteListData.splice(index, 1)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          for (const i in this.whiteListData) {
            if (this.whiteListData[i].value !== '') {
              this.formModel.whiteList.push(this.whiteListData[i].value)
            }
          }
          this.formModel.whiteList = [] // Reset white list model

          this.loading = true
          // const params = Object.assign({}, this.formModel)
          // delete params.checkPassword

          // this.handleCreateUser(params)
        } else {
          return false
        }
      })
    },
    async handleCreateUser(params) {
      try {
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
    .upload {
      margin-bottom: 20px;
    }
    .btn {
      position: absolute;
      right: -120px;
      width: 100px;
    }
  }
</style>
