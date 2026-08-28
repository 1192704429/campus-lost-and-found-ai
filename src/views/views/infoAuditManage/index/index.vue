<template>
  <div class="app-container audit-page">
    <div class="page-header">
      <div><h2>信息审核</h2><p>集中审核用户发布的失物与招领信息</p></div>
      <div class="status-summary"><span><b>{{ total }}</b> 条当前结果</span></div>
    </div>

    <div class="search-wrapper">
      <el-form :inline="true" :model="queryParams" class="search-form compact-filter" size="small">
        <el-form-item label="关键词"><el-input v-model.trim="queryParams.itemName" clearable placeholder="物品名称" @keyup.enter.native="handleQuery" /></el-form-item>
        <el-form-item label="类型"><el-select v-model="queryParams.infoType" clearable placeholder="全部类型"><el-option label="失物" :value="1" /><el-option label="招领" :value="2" /></el-select></el-form-item>
        <el-form-item label="审核状态"><el-select v-model="queryParams.auditStatus" clearable placeholder="全部状态"><el-option label="待审核" :value="0" /><el-option label="已通过" :value="1" /><el-option label="已驳回" :value="2" /></el-select></el-form-item>
        <el-form-item label="发布人"><el-input v-model.trim="queryParams.realName" clearable placeholder="学生姓名" @keyup.enter.native="handleQuery" /></el-form-item>
        <el-form-item class="search-buttons"><el-button @click="resetQuery">重置</el-button><el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button></el-form-item>
      </el-form>
    </div>

    <div class="quick-tabs">
      <button :class="{ active: queryParams.auditStatus === 0 }" @click="switchStatus(0)"><i class="el-icon-time" /> 待审核</button>
      <button :class="{ active: queryParams.auditStatus === 1 }" @click="switchStatus(1)"><i class="el-icon-circle-check" /> 已通过</button>
      <button :class="{ active: queryParams.auditStatus === 2 }" @click="switchStatus(2)"><i class="el-icon-circle-close" /> 已驳回</button>
      <button :class="{ active: queryParams.auditStatus == null }" @click="switchStatus(null)">全部</button>
    </div>

    <div class="table-wrapper">
      <el-table v-loading="loading" :data="list" class="modern-table" row-key="id">
        <el-table-column label="物品信息" min-width="250">
          <template slot-scope="scope"><div class="item-cell"><div class="cover"><image-preview v-if="scope.row.coverImage" :src="scope.row.coverImage" width="64px" height="64px" /><i v-else class="el-icon-picture-outline" /></div><div><strong>{{ scope.row.itemName || '-' }}</strong><small>{{ scope.row.infoNo }}</small><el-tag size="mini" :type="scope.row.infoType === 1 ? 'danger' : 'success'">{{ scope.row.infoType === 1 ? '失物' : '招领' }}</el-tag></div></div></template>
        </el-table-column>
        <el-table-column label="分类" prop="categoryName" width="110" align="center" show-overflow-tooltip />
        <el-table-column label="地点 / 时间" min-width="190"><template slot-scope="scope"><div class="place-time"><span><i class="el-icon-location-outline" /> {{ scope.row.occurPlace || '未填写' }}</span><small>{{ formatDate(scope.row.occurDate) }}</small></div></template></el-table-column>
        <el-table-column label="发布人" prop="realName" width="100" align="center" />
        <el-table-column label="审核状态" width="100" align="center"><template slot-scope="scope"><el-tag size="small" :type="auditType(scope.row.auditStatus)">{{ auditLabel(scope.row.auditStatus) }}</el-tag></template></el-table-column>
        <el-table-column label="提交时间" prop="createTime" width="165" align="center" />
        <el-table-column label="操作" width="150" align="center" fixed="right"><template slot-scope="scope"><el-button type="text" @click="openAudit(scope.row)">{{ scope.row.auditStatus === 0 ? '审核' : '查看详情' }}</el-button><el-button v-if="scope.row.auditStatus !== 0" type="text" @click="openAudit(scope.row, true)">重新审核</el-button></template></el-table-column>
      </el-table>
    </div>

    <pagination :total="total" :current-page.sync="queryParams.current" :page-size.sync="queryParams.size" :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <el-dialog title="信息审核" :visible.sync="auditOpen" width="760px" append-to-body custom-class="audit-dialog">
      <div v-loading="detailLoading">
        <div class="detail-hero">
          <image-preview v-if="form.coverImage" :src="form.coverImage" width="120px" height="120px" />
          <div v-else class="detail-empty"><i class="el-icon-picture-outline" /></div>
          <div><h3>{{ form.itemName || '-' }}</h3><p>{{ form.infoNo }}</p><el-tag size="small" :type="form.infoType === 1 ? 'danger' : 'success'">{{ form.infoType === 1 ? '失物信息' : '招领信息' }}</el-tag></div>
        </div>
        <el-descriptions :column="2" border class="details">
          <el-descriptions-item label="发布学生">{{ form.realName || '-' }}</el-descriptions-item><el-descriptions-item label="物品分类">{{ form.categoryName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="发生地点">{{ form.occurPlace || '-' }}</el-descriptions-item><el-descriptions-item label="发生时间">{{ form.occurDate || '-' }}</el-descriptions-item>
          <el-descriptions-item label="颜色 / 品牌">{{ [form.itemColor, form.itemBrand].filter(Boolean).join(' / ') || '-' }}</el-descriptions-item><el-descriptions-item label="联系方式">{{ form.contactPhone || form.contactMethod || '-' }}</el-descriptions-item>
          <el-descriptions-item label="物品特征" :span="2">{{ form.itemFeatures || '-' }}</el-descriptions-item><el-descriptions-item label="详细描述" :span="2">{{ form.description || '-' }}</el-descriptions-item>
          <el-descriptions-item label="全部图片" :span="2"><image-preview v-if="form.itemImages" :src="form.itemImages" width="82px" height="82px" /><span v-else>暂无图片</span></el-descriptions-item>
        </el-descriptions>
        <div class="audit-form">
          <el-form label-width="88px">
            <el-form-item label="审核结果"><el-radio-group v-model="form.auditStatus" :disabled="readOnly"><el-radio-button :label="1">审核通过</el-radio-button><el-radio-button :label="2">审核驳回</el-radio-button></el-radio-group></el-form-item>
            <el-form-item label="推荐展示"><el-switch v-model="recommend" :disabled="readOnly" active-text="推荐" inactive-text="不推荐" /></el-form-item>
            <el-form-item label="审核意见"><el-input v-model.trim="form.auditRemark" :disabled="readOnly" type="textarea" :rows="3" placeholder="通过可填写备注；驳回时请说明原因" /></el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer"><el-button @click="auditOpen=false">关闭</el-button><el-button v-if="readOnly" type="primary" @click="readOnly=false">重新审核</el-button><el-button v-else type="primary" :loading="submitting" @click="submitAudit">提交审核</el-button></div>
    </el-dialog>
  </div>
</template>

<script>
import { pageLostFoundInfo, getLostFoundInfoById, updateLostFoundInfo } from '@/api/lost_found_info'
import ImagePreview from '@/components/ImagePreview'
import Pagination from '@/components/Pagination'
export default {
  name: 'InfoAuditManage', components: { ImagePreview, Pagination },
  data() { return { loading: true, detailLoading: false, submitting: false, auditOpen: false, readOnly: false, list: [], total: 0, form: {}, recommend: false, queryParams: { current: 1, size: 10, itemName: null, infoType: null, auditStatus: 0, realName: null } } },
  created() { this.getList() },
  methods: {
    getList() { this.loading = true; const { current, size, ...entity } = this.queryParams; pageLostFoundInfo(current, size, entity).then(res => { this.list = res.data.records || []; this.total = Number(res.data.total) || 0 }).finally(() => { this.loading = false }) },
    handleQuery() { this.queryParams.current = 1; this.getList() },
    resetQuery() { this.queryParams = { current: 1, size: this.queryParams.size || 10, itemName: null, infoType: null, auditStatus: 0, realName: null }; this.getList() },
    switchStatus(status) { this.queryParams.auditStatus = status; this.handleQuery() },
    openAudit(row, forceEdit) { this.auditOpen = true; this.detailLoading = true; this.readOnly = !forceEdit && row.auditStatus !== 0; getLostFoundInfoById(row.id).then(res => { this.form = { ...(res.data || row) }; this.recommend = this.form.isRecommend === 1 }).finally(() => { this.detailLoading = false }) },
    submitAudit() { if (![1, 2].includes(this.form.auditStatus)) return this.$message.warning('请选择审核结果'); if (this.form.auditStatus === 2 && !this.form.auditRemark) return this.$message.warning('驳回时请填写审核意见'); this.form.isRecommend = this.recommend ? 1 : 0; this.submitting = true; updateLostFoundInfo(this.form).then(() => { this.$message.success('审核结果已提交'); this.auditOpen = false; this.getList() }).finally(() => { this.submitting = false }) },
    auditLabel(v) { return ({ 0: '待审核', 1: '已通过', 2: '已驳回' })[v] || '未知' }, auditType(v) { return ({ 0: 'warning', 1: 'success', 2: 'danger' })[v] || 'info' },
    formatDate(v) { return v ? String(v).slice(0, 16) : '时间待补充' },
    handleSizeChange(v) { this.queryParams.size = v; this.queryParams.current = 1; this.getList() }, handleCurrentChange(v) { this.queryParams.current = v; this.getList() }
  }
}
</script>

<style scoped lang="scss">
.audit-page{padding:24px}.page-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}.page-header h2{margin:0;color:#25384c;font-size:24px}.page-header p{margin:7px 0 0;color:#8493a5}.status-summary{padding:10px 16px;border-radius:12px;color:#60758a;background:#edf4fa}.status-summary b{color:#315f91;font-size:20px}.search-wrapper{border:1px solid #e6edf5;border-radius:14px;background:#fff}.search-form{padding:18px 18px 0}.quick-tabs{display:flex;gap:10px;margin:18px 0}.quick-tabs button{padding:9px 15px;border:1px solid #dce6ef;border-radius:9px;color:#64788c;background:#fff;cursor:pointer}.quick-tabs button.active{border-color:#315f91;color:#fff;background:#315f91;box-shadow:0 5px 12px rgba(49,95,145,.2)}.table-wrapper{overflow:hidden;border:1px solid #e5edf4;border-radius:14px;background:#fff}.item-cell{display:flex;align-items:center;gap:12px}.cover,.detail-empty{display:flex;align-items:center;justify-content:center;overflow:hidden;flex:none;border-radius:10px;color:#9badbd;background:#eef3f7;font-size:24px}.cover{width:64px;height:64px}.item-cell strong,.item-cell small{display:block;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.item-cell strong{margin-bottom:5px;color:#263b50}.item-cell small{margin-bottom:6px;color:#93a1af;font-size:11px}.place-time span,.place-time small{display:block}.place-time span{overflow:hidden;color:#536a80;text-overflow:ellipsis;white-space:nowrap}.place-time small{margin-top:7px;color:#9aa8b6}.detail-hero{display:flex;align-items:center;gap:20px;padding:0 0 20px}.detail-hero h3{margin:0 0 7px;color:#263b50;font-size:22px}.detail-hero p{margin:0 0 10px;color:#8a99a8}.detail-empty{width:120px;height:120px}.details{margin-bottom:20px}.audit-form{padding:18px 18px 1px;border-radius:12px;background:#f6f9fc}@media(max-width:700px){.audit-page{padding:14px}.page-header{align-items:flex-start}.status-summary{display:none}.quick-tabs{overflow-x:auto}.detail-hero{align-items:flex-start}}
</style>
