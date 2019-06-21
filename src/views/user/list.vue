<template>
  <div class="app-container">
    <div v-permission="['MANAGER']" class="clearfix" style="margin-bottom: 20px;">
      <router-link to="/user/create">
        <el-button type="primary">
          {{ $t('user.createUserButton') }}
        </el-button>
      </router-link>
    </div>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        width="120px"
        align="center"
        prop="username"
        label="用户名"
      />

      <el-table-column
        width="120px"
        align="center"
        label="角色"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.role | parseUserType }}</span>
        </template>
      </el-table-column>

      <el-table-column
        min-width="300px"
        align="center"
        prop="address"
        label="绑定地址"
      />

      <el-table-column
        width="150px"
        align="center"
        label="上次登录时间"
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
        <template v-if="role === 'MANAGER' && scope.row.username !== name" slot-scope="scope">
          <el-button type="primary" size="small" style="margin-left: 10px;" @click.native.prevent="handleDisabledPopup(scope.row.adminId, scope.row.disabled)">{{ scope.row.disabled === 1 ? '恢复' : '禁用' }}</el-button>
          <router-link :to="`/user/edit/${scope.row.adminId}`">
            <el-button type="primary" size="small">修改</el-button>
          </router-link>
          <el-button type="primary" size="small" @click.native.prevent="handleDeletePopup(scope.row.adminId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
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
      signatureType: 'APPLY',
      recordId: '',
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      listLoading: false
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
    handleDisabledPopup(adminId, disabled) {
      disabled = disabled === 0 ? 1 : 0
      this.$confirm(disabled === 0 ? '是否确认恢复该用户？' : '是否确认禁用该用户？', '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDisabled(adminId, disabled)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
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
    handleDeletePopup(adminId) {
      this.$confirm('一旦删除不可恢复，是否确认删除该用户？', '提示', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.handleDelete(adminId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
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
