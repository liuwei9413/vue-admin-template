<template>
  <div class="app-container" :loading="signLoading">
    <div class="title-container">
      <p v-for="(item, index) in headerData" :key="index" class="item">
        <span class="key">{{ item.key }}</span>
        <span class="value">{{ item.value }}</span>
      </p>
    </div>
    <div class="card-container clearfix">
      <detail-card v-if="type !== ''" class="card-box" :data="data" :title="title" :loading="listLoading" />
      <detail-card v-if="type === 'EDIT_ADMIN'" class="card-box" :data="historyData" :title="historyTitle" :loading="historyLoading" />
      <div v-else class="card-box">
        <h4>{{ reasonTitle }}</h4>
        <p>{{ reason }}</p>
      </div>
    </div>
    <div class="button-container">
      <el-button style="width:200px;" type="primary" @click="handleAudit(1)">通过</el-button>
      <el-button style="width:200px;" type="warning" @click="dialogFormVisible = true">不通过</el-button>
    </div>
    <el-dialog title="输入不通过的原因" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="auditForm" :model="auditForm" :rules="rules">
        <el-form-item prop="reason">
          <el-input v-model.trim="auditForm.reason" type="textarea" autocomplete="off" placeholder="100字以内" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAudit(2)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchRecordInfo, fetchUserInfo, auditUser } from '@/api/user'
import DetailCard from '@/components/DetailCard'
import { parseUserType } from '@/utils'
import { handleSign, recordSignature } from '@/utils/sign'

export default {
  name: 'UserAuditDetail',
  components: { DetailCard },
  data() {
    return {
      recordId: this.$route.params && this.$route.params.id,
      signatureType: 'VERIFY',
      signLoading: false,
      type: '',
      headerData: [
        {
          key: '操作人',
          value: ''
        },
        {
          key: '操作时间',
          value: ''
        },
        {
          key: '操作类型',
          value: ''
        }
      ],
      title: '',
      data: [
        {
          key: '用户名',
          value: ''
        },
        {
          key: '绑定地址',
          value: ''
        },
        {
          key: '角色',
          value: ''
        },
        {
          key: '联系邮箱',
          value: ''
        }
      ],
      reasonTitle: '',
      reason: '',
      listLoading: false,
      historyTitle: '原始信息',
      historyData: [
        {
          key: '用户名',
          value: ''
        },
        {
          key: '绑定地址',
          value: ''
        },
        {
          key: '角色',
          value: ''
        },
        {
          key: '联系邮箱',
          value: ''
        }
      ],
      historyLoading: false,
      dialogFormVisible: false,
      auditForm: {
        reason: ''
      },
      rules: {
        reason: [
          { required: true, message: '请输入原因', trigger: 'blur' },
          { max: 100, message: '100字以内', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    (async() => {
      const id = this.recordId
      const { data } = await this.fetchData(id)
      this.listLoading = false
      this.type = data.actionType
      const adminId = data.adminId

      this.headerData[0].value = data.operator
      this.headerData[1].value = data.createTime.substring(0, 10)
      if (this.type === 'EDIT_ADMIN') {
        this.title = '修改后信息'
        this.headerData[2].value = '修改接入端'

        const historyDataRes = await this.fetchHistory(adminId)
        const historyData = historyDataRes.data
        this.historyLoading = false
        this.historyData[0].value = historyData.username
        this.historyData[1].value = historyData.address
        this.historyData[2].value = parseUserType(historyData.role)
        this.historyData[3].value = historyData.email
      } else {
        switch (this.type) {
          case 'NEW_ADMIN':
            this.title = '新增接入端'
            this.headerData[2].value = '新增接入端'
            break
          case 'DISABLE_ADMIN':
            this.title = '禁用接入端'
            this.headerData[2].value = '禁用接入端'
            break
          case 'ENABLE_ADMIN':
            this.title = '恢复接入端'
            this.headerData[2].value = '恢复接入端'
            break
          case 'DELETE_ADMIN':
            this.title = '删除接入端'
            this.headerData[2].value = '删除接入端'
            break
        }
      }

      this.data[0].value = data.username
      this.data[1].value = data.address
      this.data[2].value = parseUserType(data.role)
      this.data[3].value = data.email
    })()
  },
  methods: {
    async fetchData(recordId) {
      this.listLoading = true
      return fetchRecordInfo({ recordId: recordId })
    },
    async fetchHistory(adminId) {
      this.historyLoading = true
      return fetchUserInfo({ adminId: adminId })
    },
    async handleAudit(status) {
      const reason = status === 1 ? '' : this.auditForm.reason
      const params = {
        rejectReason: reason,
        verifyStatus: status
      }
      if (status === 2) {
        this.$refs.auditForm.validateField('reason', (valid) => {
          if (!valid) {
            this.signFunc(params)
          }
        })
      } else {
        this.signFunc(params)
      }
    },
    async signFunc(params) {
      this.signLoading = true
      const signInfoRes = await auditUser({ recordId: this.recordId }, params)
      this.$message.success('获取待签名信息成功，待签名...' || signInfoRes.message)
      this.signInfo = signInfoRes.data.needSignedInfo
      this.recordId = signInfoRes.data.recordId

      // Sign by vekey
      const signatureRes = await handleSign(this.signInfo)
      const signature = signatureRes.data && signatureRes.data.signature

      // Record the signature
      this.handleSignature({ recordId: this.recordId }, { signature: signature, signatureType: this.signatureType })
    },
    handleSignature(path, body) {
      recordSignature(path, body)
        .then(() => {
          this.signLoading = false
          this.$alert('审核成功', '操作成功', {
            confirmButtonText: '好的',
            callback: action => {
              this.$router.push({ path: '/user/audit-list' })
            }
          })
        })
        .catch(() => {
          this.signLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
 .app-container {
   .title-container {
     margin-bottom: 20px;
     padding: 0 20px 20px;
     border-bottom: 1px solid #EBEEF5;
     .item {
       margin-right: 30px;
       display: inline-block;
       vertical-align: middle;
       .key {
         margin-right: 10px;
       }
       .value {
         color: #5e6d82;
       }
     }
   }
   .card-container {
     margin-bottom: 40px;
     .card-box {
       float: left;
       margin-right: 5%;
       width: 45%;
    }
   }

 }
</style>
