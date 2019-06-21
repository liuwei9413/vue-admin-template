<template>
  <div class="app-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" @tab-click="handleClick">
      <el-tab-pane key="first" label="待审核" name="first">
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
            width="120px"
            align="center"
            prop="operator"
            label="操作人"
          />

          <el-table-column
            width="150px"
            align="center"
            label="操作时间"
          >
            <template slot-scope="scope">
              <span>{{ new Date(scope.row.createTime).getTime() | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>

          <el-table-column
            width="120px"
            align="center"
            label="操作类型"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.actionType | parseActionType }}</span>
            </template>
          </el-table-column>

          <el-table-column
            min-width="100px"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <!-- <el-button v-if="name === scope.row.operator" type="primary" size="small" @click.native.prevent="handleWidthdraw(scope.row.recordId)">撤回</el-button> -->
              <router-link v-if="name !== scope.row.operator" :to="`/user/audit-detail/${scope.row.recordId}`">
                <el-button type="primary" size="small">去审核</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />
      </el-tab-pane>
      <el-tab-pane key="second" label="审核历史" name="second">
        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
          <el-table-column
            width="120px"
            align="center"
            label="操作类型"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.actionType | parseActionType }}</span>
            </template>
          </el-table-column>

          <el-table-column
            width="120px"
            align="center"
            prop="operator"
            label="操作人"
          />

          <el-table-column
            width="150px"
            align="center"
            label="操作时间"
          >
            <template slot-scope="scope">
              <span>{{ new Date(scope.row.opTime).getTime() | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>

          <el-table-column
            width="120px"
            align="center"
            prop="assessor"
            label="审核人"
          />

          <el-table-column
            width="150px"
            align="center"
            label="审核时间"
          >
            <template slot-scope="scope">
              <span>{{ new Date(scope.row.asTime).getTime() | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>

          <el-table-column
            width="100px"
            align="center"
            label="审核结果"
          >
            <template slot-scope="scope">
              <span :class="scope.row.verifyStatus === 1 ? 'success' : 'reject'">{{ scope.row.verifyStatus === 1 ? '成功' : '拒绝' }}</span>
            </template>
          </el-table-column>

          <el-table-column
            min-width="200px"
            align="center"
            label="拒绝原因"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.verifyStatus === 2 ? scope.row.rejectReason : '' }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fetchAuditList, fetchAuditHistory } from '@/api/user'
import Pagination from '@/components/Pagination'

export default {
  name: 'AuditList',
  components: { Pagination },
  data() {
    return {
      tabMapOptions: [
        { label: '待审核', key: 'first' },
        { label: '审核历史', key: 'second' }
      ],
      activeName: 'first',
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        size: 10
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default  selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
    if (this.activeName === 'first') {
      this.getList()
    } else if (this.activeName === 'second') {
      this.getHistory()
    }
  },
  methods: {
    handleClick(tab) {
      this.activeName = tab.name
      if (this.activeName === 'first') {
        this.listQuery.page = 1
        this.getList()
      } else if (this.activeName === 'second') {
        this.listQuery.page = 1
        this.getHistory()
      }
    },
    getList() {
      this.listLoading = true
      fetchAuditList(this.listQuery)
        .then(res => {
          this.listLoading = false
          this.list = res.data.list
          this.total = res.data.total
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleWidthdraw(id) {
      debugger
      this.deleteId = id
      // this.disabled = disabled === 'Y' ? 'N' : 'Y'
      // if (disabled === 'N') {
      //   this.$confirm('是否确认禁用该用户？', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     this.handleDelete()
      //   }).catch(() => {
      //     this.$message({
      //       type: 'info',
      //       message: '已取消'
      //     })
      //   })
      // } else {
      //   this.handleRecover()
      // }
    },
    getHistory() {
      this.listLoading = true
      fetchAuditHistory(this.listQuery)
        .then(res => {
          this.listLoading = false
          this.list = res.data.list
          this.total = res.data.total
        })
        .catch(() => {
          this.listLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .success {
    color: #67C23A;
  }
  .reject {
    color: #F56C6C;
  }
</style>
