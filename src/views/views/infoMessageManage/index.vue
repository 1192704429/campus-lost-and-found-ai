<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="small">
      <el-form-item label="关键字">
        <el-input v-model="queryParams.keyword" clearable placeholder="内容、物品或学生姓名" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="留言状态">
        <el-select v-model="queryParams.status" clearable placeholder="全部">
          <el-option label="隐藏" :value="0" />
          <el-option label="正常" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="留言时间">
        <el-date-picker
          v-model="createTimeRange"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button type="danger" plain :disabled="!ids.length" @click="handleBatchDelete">批量删除</el-button>
    <el-table v-loading="loading" :data="list" style="margin-top: 16px" @selection-change="selectionChange">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="itemName" label="关联物品" min-width="130" show-overflow-tooltip />
      <el-table-column prop="realName" label="留言学生" width="110" />
      <el-table-column prop="messageContent" label="留言内容" min-width="260" show-overflow-tooltip />
      <el-table-column prop="realName2" label="回复对象" width="110">
        <template slot-scope="{ row }">{{ row.realName2 || '-' }}</template>
      </el-table-column>
      <el-table-column label="类型" width="80">
        <template slot-scope="{ row }">{{ row.parentId ? '回复' : '留言' }}</template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '正常' : '隐藏' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="留言时间" width="165" />
      <el-table-column label="操作" width="130" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" @click="openDetail(row)">详情</el-button>
          <el-button type="text" class="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :current-page.sync="queryParams.current"
      :page-size.sync="queryParams.size"
      @size-change="sizeChange"
      @current-change="getList"
    />

    <el-dialog title="留言详情" :visible.sync="detailVisible" width="580px">
      <el-descriptions v-if="detail.id" :column="1" border>
        <el-descriptions-item label="关联物品">{{ detail.itemName }}</el-descriptions-item>
        <el-descriptions-item label="留言学生">{{ detail.realName }}</el-descriptions-item>
        <el-descriptions-item label="回复对象">{{ detail.realName2 || '-' }}</el-descriptions-item>
        <el-descriptions-item label="上级留言ID">{{ detail.parentId || '-' }}</el-descriptions-item>
        <el-descriptions-item label="留言内容">{{ detail.messageContent }}</el-descriptions-item>
        <el-descriptions-item label="留言状态">{{ detail.status === 1 ? '正常' : '隐藏' }}</el-descriptions-item>
        <el-descriptions-item label="留言时间">{{ detail.createTime }}</el-descriptions-item>
      </el-descriptions>
      <span slot="footer"><el-button type="primary" @click="detailVisible = false">确 定</el-button></span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  pageInfoMessage,
  getInfoMessageById,
  deleteInfoMessage,
  deleteBatchInfoMessage
} from '@/api/info_message'

export default {
  name: 'InfoMessageManage',
  components: { Pagination },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      ids: [],
      detail: {},
      detailVisible: false,
      createTimeRange: [],
      queryParams: { current: 1, size: 10, keyword: null, status: null }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const { current, size, ...filters } = this.queryParams
      const data = {
        ...filters,
        createTimeStart: this.createTimeRange && this.createTimeRange[0],
        createTimeEnd: this.createTimeRange && this.createTimeRange[1]
      }
      pageInfoMessage(current, size, data).then(response => {
        this.list = response.data.records || []
        this.total = Number(response.data.total) || 0
      }).finally(() => {
        this.loading = false
      })
    },
    handleQuery() {
      this.queryParams.current = 1
      this.getList()
    },
    resetQuery() {
      this.queryParams = { current: 1, size: this.queryParams.size, keyword: null, status: null }
      this.createTimeRange = []
      this.getList()
    },
    sizeChange(size) {
      this.queryParams.size = size
      this.queryParams.current = 1
      this.getList()
    },
    selectionChange(rows) {
      this.ids = rows.map(item => item.id)
    },
    openDetail(row) {
      getInfoMessageById(row.id).then(response => {
        this.detail = response.data
        this.detailVisible = true
      })
    },
    handleDelete(row) {
      this.$confirm('删除后无法恢复，确认删除该留言？', '警告', { type: 'warning' }).then(() => deleteInfoMessage(row.id)).then(() => {
        this.$message.success('删除成功')
        this.getList()
      }).catch(() => {})
    },
    handleBatchDelete() {
      this.$confirm(`删除后无法恢复，确认删除选中的 ${this.ids.length} 条留言？`, '警告', { type: 'warning' }).then(() => deleteBatchInfoMessage(this.ids)).then(() => {
        this.$message.success('批量删除成功')
        this.getList()
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.danger { color: #f56c6c; }
</style>
