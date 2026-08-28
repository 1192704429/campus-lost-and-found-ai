<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" size="small">
      <el-form-item label="关键字">
        <el-input v-model="queryParams.keyword" clearable placeholder="编号、物品、原因或举报人" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="举报类型">
        <el-select v-model="queryParams.reportType" clearable placeholder="全部">
          <el-option label="虚假信息" :value="1" />
          <el-option label="不良内容" :value="2" />
          <el-option label="联系方式异常" :value="3" />
          <el-option label="重复发布" :value="4" />
          <el-option label="其他" :value="5" />
        </el-select>
      </el-form-item>
      <el-form-item label="处理状态">
        <el-select v-model="queryParams.handleStatus" clearable placeholder="全部">
          <el-option label="待处理" :value="0" />
          <el-option label="已处理" :value="1" />
          <el-option label="已驳回" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="举报时间">
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
      <el-table-column prop="reportNo" label="举报编号" min-width="140" />
      <el-table-column prop="itemName" label="物品名称" min-width="120" show-overflow-tooltip />
      <el-table-column prop="realName" label="举报人" width="100" />
      <el-table-column label="举报类型" width="100">
        <template slot-scope="{ row }">{{ reportTypeText[row.reportType] || '其他' }}</template>
      </el-table-column>
      <el-table-column prop="reportReason" label="举报原因" min-width="180" show-overflow-tooltip />
      <el-table-column label="状态" width="90">
        <template slot-scope="{ row }">
          <el-tag :type="statusType[row.handleStatus]">{{ statusText[row.handleStatus] || '未知' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="举报时间" width="165" />
      <el-table-column prop="realName2" label="处理人" width="100" />
      <el-table-column label="操作" width="190" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" @click="openDetail(row)">详情</el-button>
          <el-button type="text" @click="openHandle(row)">{{ row.handleStatus === 0 ? '处理' : '重新处理' }}</el-button>
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

    <el-dialog title="举报详情与信息核对" :visible.sync="detailVisible" width="780px" append-to-body>
      <template v-if="detail.id">
      <div class="detail-section-title"><i class="el-icon-warning-outline" /> 举报内容</div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="举报编号">{{ detail.reportNo }}</el-descriptions-item>
        <el-descriptions-item label="举报人">{{ detail.realName }}</el-descriptions-item>
        <el-descriptions-item label="举报类型">{{ reportTypeText[detail.reportType] || '其他' }}</el-descriptions-item>
        <el-descriptions-item label="举报时间">{{ detail.createTime }}</el-descriptions-item>
        <el-descriptions-item label="举报原因" :span="2">{{ detail.reportReason }}</el-descriptions-item>
        <el-descriptions-item label="举报图片" :span="2">
          <image-preview v-if="detail.reportImages" :src="detail.reportImages" width="80px" height="80px" />
          <span v-else>无</span>
        </el-descriptions-item>
        <el-descriptions-item label="处理结果" :span="2">{{ detail.handleResult || '未处理' }}</el-descriptions-item>
        <el-descriptions-item label="处理信息" :span="2">
          {{ detail.realName2 || '-' }} / {{ detail.handleTime || '-' }}
        </el-descriptions-item>
      </el-descriptions>
      <div class="detail-section-title info-title"><i class="el-icon-document" /> 被举报信息</div>
      <div class="reported-hero">
        <image-preview v-if="detail.coverImage" :src="detail.coverImage" width="110px" height="110px" />
        <div v-else class="report-cover-empty"><i class="el-icon-picture-outline" /></div>
        <div><h3>{{ detail.itemName || '关联信息已删除' }}</h3><p>{{ detail.infoNo || '-' }}</p><el-tag size="small" :type="detail.infoType===1?'danger':'success'">{{detail.infoType===1?'失物':'招领'}}</el-tag><el-tag size="small" :type="auditType(detail.auditStatus)">{{auditText(detail.auditStatus)}}</el-tag><el-tag size="small" type="info">{{publishText(detail.publishStatus)}}</el-tag></div>
      </div>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="发生地点">{{detail.occurPlace||'-'}}</el-descriptions-item><el-descriptions-item label="发生时间">{{detail.occurDate||'-'}}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{detail.contactName||'-'}}</el-descriptions-item><el-descriptions-item label="联系电话">{{detail.contactPhone||'-'}}</el-descriptions-item>
        <el-descriptions-item label="物品特征" :span="2">{{detail.itemFeatures||'-'}}</el-descriptions-item><el-descriptions-item label="发布描述" :span="2">{{detail.description||'-'}}</el-descriptions-item>
        <el-descriptions-item label="全部图片" :span="2"><image-preview v-if="detail.itemImages" :src="detail.itemImages" width="82px" height="82px" /><span v-else>暂无图片</span></el-descriptions-item>
      </el-descriptions>
      </template>
      <span slot="footer"><el-button @click="detailVisible = false">关闭</el-button><el-button type="primary" @click="detailVisible=false;openHandle(detail)">{{detail.handleStatus===0?'处理举报':'重新处理'}}</el-button></span>
    </el-dialog>

    <el-dialog title="处理举报" :visible.sync="handleVisible" width="520px">
      <el-form ref="handleForm" :model="handleForm" :rules="handleRules" label-width="90px">
        <el-form-item label="处理结论" prop="handleStatus">
          <el-radio-group v-model="handleForm.handleStatus">
            <el-radio :label="1">确认处理</el-radio>
            <el-radio :label="2">驳回举报</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理结果" prop="handleResult">
          <el-input v-model="handleForm.handleResult" type="textarea" :rows="4" maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleVisible = false">取消</el-button>
        <el-button type="primary" @click="submitHandle">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import ImagePreview from '@/components/ImagePreview'
import {
  pageInfoReport,
  getInfoReportById,
  handleInfoReport,
  deleteInfoReport,
  deleteBatchInfoReport
} from '@/api/info_report'

export default {
  name: 'InfoReportManage',
  components: { Pagination, ImagePreview },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      ids: [],
      createTimeRange: [],
      detailVisible: false,
      handleVisible: false,
      detail: {},
      queryParams: { current: 1, size: 10, keyword: null, reportType: null, handleStatus: null },
      handleForm: { id: null, handleStatus: 1, handleResult: '' },
      handleRules: {
        handleStatus: [{ required: true, message: '请选择处理结论', trigger: 'change' }],
        handleResult: [{ required: true, message: '请输入处理结果', trigger: 'blur' }]
      },
      reportTypeText: { 1: '虚假信息', 2: '不良内容', 3: '联系方式异常', 4: '重复发布', 5: '其他' },
      statusText: { 0: '待处理', 1: '已处理', 2: '已驳回' },
      statusType: { 0: 'warning', 1: 'success', 2: 'info' }
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
      pageInfoReport(current, size, data).then(response => {
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
      this.queryParams = { current: 1, size: this.queryParams.size, keyword: null, reportType: null, handleStatus: null }
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
      getInfoReportById(row.id).then(response => {
        this.detail = response.data
        this.detailVisible = true
      })
    },
    openHandle(row) {
      this.handleForm = { id: row.id, handleStatus: row.handleStatus === 2 ? 2 : 1, handleResult: row.handleResult || '' }
      this.handleVisible = true
      this.$nextTick(() => this.$refs.handleForm && this.$refs.handleForm.clearValidate())
    },
    submitHandle() {
      this.$refs.handleForm.validate(valid => {
        if (!valid) return
        const action = this.handleForm.handleStatus === 1 ? '确认处理该举报' : '确认驳回该举报'
        this.$confirm(action + '？', '提示', { type: 'warning' }).then(() => handleInfoReport(this.handleForm)).then(() => {
          this.$message.success('处理成功')
          this.handleVisible = false
          this.getList()
        }).catch(() => {})
      })
    },
    auditText(v) { return ({ 0: '待审核', 1: '已通过', 2: '已驳回' })[v] || '未知' },
    auditType(v) { return ({ 0: 'warning', 1: 'success', 2: 'danger' })[v] || 'info' },
    publishText(v) { return ({ 0: '已下架', 1: '进行中', 2: '处理中', 3: '已完成' })[v] || '状态未知' },
    handleDelete(row) {
      this.$confirm('确认删除该举报记录？', '警告', { type: 'warning' }).then(() => deleteInfoReport(row.id)).then(() => {
        this.$message.success('删除成功')
        this.getList()
      }).catch(() => {})
    },
    handleBatchDelete() {
      this.$confirm(`确认删除选中的 ${this.ids.length} 条举报记录？`, '警告', { type: 'warning' }).then(() => deleteBatchInfoReport(this.ids)).then(() => {
        this.$message.success('批量删除成功')
        this.getList()
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.danger { color: #f56c6c; }
.detail-section-title{margin:0 0 12px;color:#344b61;font-size:16px;font-weight:600}.detail-section-title i{margin-right:7px;color:#d97862}.info-title{margin-top:24px}.info-title i{color:#4779a8}.reported-hero{display:flex;align-items:center;gap:18px;margin-bottom:16px;padding:16px;border-radius:12px;background:#f5f8fb}.reported-hero h3{margin:0 0 7px;color:#263b50;font-size:20px}.reported-hero p{margin:0 0 9px;color:#8998a8}.reported-hero .el-tag{margin-right:7px}.report-cover-empty{display:flex;width:110px;height:110px;align-items:center;justify-content:center;flex:none;border-radius:10px;color:#9bacbc;background:#eaf0f5;font-size:28px}
</style>
