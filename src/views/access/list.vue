<template>
  <div class="app-container">
    <div v-permission="['OPERATOR']" class="clearfix" style="margin-bottom: 20px;">
      <router-link to="/access/create">
        <el-button type="primary">
          增加接入端
        </el-button>
      </router-link>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        width="120px"
        align="center"
        prop="accessName"
        label="接入端名称"
      />

      <el-table-column
        width="120px"
        align="center"
        prop="accessId"
        label="接入端ID"
      />

      <el-table-column
        width="120px"
        align="center"
        prop="username"
        label="联系人"
      />

      <el-table-column
        width="120px"
        align="center"
        prop="email"
        label="联系方式"
      />

      <el-table-column
        width="120px"
        align="center"
        label="签名类型"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.role | parseSignType }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="120px"
        align="center"
        label="白名单列表"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.role | parseSignType }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="150px"
        align="center"
        label="添加时间"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.loginTime">{{ new Date(scope.row.loginTime).getTime() | parseTime('{y}-{m}-{d}') }}</span>
          <span v-else>暂未登录</span>
        </template>
      </el-table-column>

      <el-table-column
        width="100px"
        align="center"
        label="状态"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.disabled === 0 ? '正常' : '禁用' }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="240px"
        label="操作"
        align="center"
      >
        <template v-if="role === 'OPERATOR' && scope.row.username !== name" slot-scope="scope">
          <el-button type="primary" size="small" style="margin-left: 10px;" @click.native.prevent="handleDisabledPopup(scope.row.adminId, scope.row.disabled)">{{ scope.row.disabled === 1 ? '恢复' : '禁用' }}</el-button>
          <router-link :to="`/user/edit/${scope.row.adminId}`">
            <el-button type="primary" size="small">修改</el-button>
          </router-link>
          <el-button type="primary" size="small" @click.native.prevent="handleDeletePopup(scope.row.adminId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="auditForm" :model="auditForm" :rules="rules">
        <el-form-item prop="reason">
          <el-input v-model.trim="auditForm.reason" type="textarea" autocomplete="off" placeholder="100字以内" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleContinue">继 续</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchUserList, disabledUser, deleteUser } from '@/api/user'
import Pagination from '@/components/Pagination'
import { handleSign, recordSignature } from '@/utils/sign'

export default {
  name: 'UserList',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      dialogFormVisible: false,
      dialogTitle: '',
      dialogType: ''
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'role'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchUserList(this.listQuery)
        .then(res => {
          this.list = res.data.list
          this.total = res.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handlePopup(type, adminId, disabled) {
      this.dialogType = type
      this.adminId = adminId
      if (this.dialogType === 'delete') {
        this.dialogTitle = '请填写删除该接入端的理由'
      } else {
        this.disabled = disabled === 0 ? 1 : 0
        this.dialogTitle = this.disabled === 1 ? '请填写禁用该接入端的理由' : '请填写恢复该接入端的理由'
      }
    },
    handleContinue() {
      if (this.dialogType === 'delete') {
        this.handleDelete(this.adminId)
      } else {
        this.handleDisabled(this.adminId, this.disabled)
      }
    },
    // handleDisabledPopup(adminId, disabled) {
    //   disabled = disabled === 0 ? 1 : 0
    //   this.$confirm(disabled === 0 ? '是否确认恢复该用户？' : '是否确认禁用该用户？', '提示', {
    //     confirmButtonText: '继续',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.handleDisabled(adminId, disabled)
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消'
    //     })
    //   })
    // },
    async handleDisabled(adminId, disabled) {
      // Get sign info
      const signInfoRes = await disabledUser({ adminId: adminId }, { disabled: disabled })
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
          this.$alert('等待审核员审核！', '操作成功', {
            confirmButtonText: '好的',
            callback: action => {
              this.getList()
            }
          })
        }).catch(() => {
        })
    },
    // handleDeletePopup(adminId) {
    //   this.$confirm('一旦删除不可恢复，是否确认删除该用户？', '提示', {
    //     confirmButtonText: '继续',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.handleDelete(adminId)
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消'
    //     })
    //   })
    // },
    async handleDelete(adminId) {
      // Get sign info
      const signInfoRes = await deleteUser({ adminId: adminId })
      this.$message.success('获取待签名信息成功，待签名...' || signInfoRes.message)
      const signInfo = signInfoRes.data.needSignedInfo
      this.recordId = signInfoRes.data.recordId

      // Sign by vekey
      const signatureRes = await handleSign(signInfo)
      const signature = signatureRes.data && signatureRes.data.signature

      // Record the signature
      this.handleSignature({ recordId: this.recordId }, { signature: signature, signatureType: this.signatureType })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
