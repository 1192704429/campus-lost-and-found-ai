<template>
  <main class="my-publish">
    <div class="page-heading"><span class="heading-icon"><i class="el-icon-document" /></span><div><h1>我的发布</h1><p>管理你发布的失物与招领信息</p></div></div>
    <el-tabs v-model="type" @tab-click="loadData"><el-tab-pane label="我的失物" name="1" /><el-tab-pane label="我的招领" name="2" /></el-tabs>
    <el-skeleton v-if="loading" :rows="6" animated />
    <el-empty v-else-if="!items.length" description="暂无发布信息" />
    <div v-else class="card-grid">
      <article v-for="row in items" :key="row.id" class="content-card">
        <div class="cover-wrap"><el-image class="cover" :src="row.coverImage" fit="cover"><div slot="error" class="image-empty"><i class="el-icon-picture-outline" /></div></el-image><span class="type-badge">{{ row.infoType===1?'失物':'招领' }}</span></div>
        <div class="card-body"><div class="card-title"><h3>{{ row.itemName }}</h3><span>{{ row.categoryName || '未分类' }}</span></div>
        <p class="location"><i class="el-icon-location-outline" /> {{ row.occurPlace || '地点待补充' }}</p>
        <div class="status-row"><el-tag :type="auditType(row.auditStatus)" size="mini">{{ auditLabel(row.auditStatus) }}</el-tag><el-tag :type="publishType(row.publishStatus)" size="mini">{{ publishLabel(row) }}</el-tag><time>{{ String(row.createTime||'').slice(0,10) }}</time></div>
        <div class="card-actions">
        <el-button type="text" @click="view(row)">查看</el-button>
        <el-button v-if="[0,2].includes(row.auditStatus)" type="text" @click="edit(row)">修改</el-button>
        <el-button type="text" class="danger" @click="remove(row)">删除</el-button>
        <el-button v-if="row.auditStatus===1 && row.publishStatus===1" type="text" @click="complete(row)">{{ row.infoType===1 ? '标记已找到' : '标记已归还' }}</el-button>
        <el-button v-if="row.infoType===2 && row.publishStatus===2" type="text" @click="$router.push('/user/received-claims')">查看认领申请</el-button>
        </div></div>
      </article>
    </div>
    <el-dialog :title="'修改'+(form.infoType===1?'失物':'招领')+'信息'" :visible.sync="open" width="560px">
      <el-form :model="form" label-width="90px"><el-form-item label="物品名称"><el-input v-model="form.itemName" /></el-form-item><el-form-item label="地点"><el-input v-model="form.occurPlace" /></el-form-item><el-form-item label="描述"><el-input v-model="form.description" type="textarea" /></el-form-item><el-form-item v-if="form.infoType===2" label="物品特征"><el-input v-model="form.itemFeatures" type="textarea" /></el-form-item><el-form-item v-if="form.infoType===2" label="领取方式"><el-input v-model="form.claimMethod" /></el-form-item></el-form>
      <div slot="footer"><el-button @click="open=false">取消</el-button><el-button type="primary" @click="save">保存</el-button></div>
    </el-dialog>
  </main>
</template>
<script>
import { clientCompleteLostFound, clientDeleteLostFound, clientMyLostFound, clientUpdateLostFound } from '@/api/client-user'
export default {
  name: 'ClientMyPublish',
  data() { return { type: '1', loading: true, items: [], open: false, form: {} } },
  created() { this.loadData() },
  methods: {
    async loadData() { this.loading = true; try { const res = await clientMyLostFound({ infoType: Number(this.type) }); this.items = res.data || [] } finally { this.loading = false } },
    auditLabel(v) { return ({ 0: '待审核', 1: '已通过', 2: '已驳回' })[v] || '未知' },
    auditType(v) { return ({ 0: 'warning', 1: 'success', 2: 'danger' })[v] || 'info' },
    publishLabel(row) { return row.infoType === 1 ? ({ 0: '已关闭', 1: '寻找中', 2: '已匹配', 3: '已找到' })[row.publishStatus] : ({ 0: '已关闭', 1: '待认领', 2: '认领中', 3: '已归还' })[row.publishStatus] },
    publishType(v) { return ({ 0: 'info', 1: 'warning', 2: 'primary', 3: 'success' })[v] || 'info' },
    view(row) { this.$router.push({ path: `/user/detail/${row.id}`, query: { mine: '1' } }) },
    edit(row) { this.form = { ...row }; this.open = true },
    async save() { await clientUpdateLostFound(this.form.id, this.form); this.$message.success('保存成功，等待重新审核'); this.open = false; this.loadData() },
    async remove(row) { await this.$confirm('确认删除该信息吗？', '提示'); await clientDeleteLostFound(row.id); this.$message.success('删除成功'); this.loadData() },
    async complete(row) { await this.$confirm(`确认${row.infoType === 1 ? '已找到物品' : '已完成归还'}吗？`, '提示'); await clientCompleteLostFound(row.id); this.loadData() }
  }
}
</script>
<style scoped lang="scss">@import "./user-center-cards.scss";.type-badge{background:#315f91}.my-publish ::v-deep .el-tabs__nav-wrap:after{height:1px;background:#e6edf5}</style>
