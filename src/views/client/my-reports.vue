<template>
  <main class="reports">
    <div class="page-heading"><span class="heading-icon"><i class="el-icon-warning-outline" /></span><div><h1>我的举报</h1><p>查看你提交的举报及处理进度</p></div></div>
    <el-skeleton v-if="loading" :rows="6" animated />
    <el-empty v-else-if="!items.length" description="你还没有提交过举报" />
    <div v-else class="report-grid"><article v-for="row in items" :key="row.id" class="report-card"><div class="report-top"><span>{{ row.reportNo }}</span><el-tag :type="statusType(row.handleStatus)" size="small">{{ statusLabel(row.handleStatus) }}</el-tag></div><h3>{{ row.itemName || `信息 #${row.infoId}` }}</h3><div class="report-block"><label>举报原因</label><p>{{ row.reportReason }}</p></div><div class="report-block result"><label>处理结果</label><p>{{ row.handleResult || '管理员正在核实，请耐心等待处理结果' }}</p></div><time><i class="el-icon-time" /> 提交于 {{ row.createTime }}</time></article></div>
  </main>
</template>

<script>
import { clientMyReports } from '@/api/client-user'

export default {
  name: 'ClientMyReports',
  data() { return { loading: true, items: [] } },
  created() { this.loadData() },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const res = await clientMyReports()
        this.items = res.data || []
      } finally { this.loading = false }
    },
    statusLabel(value) { return ({ 0: '待处理', 1: '已处理', 2: '已驳回' })[Number(value)] || '未知' },
    statusType(value) { return ({ 0: 'warning', 1: 'success', 2: 'info' })[Number(value)] || 'info' }
  }
}
</script>

<style scoped lang="scss">@import "./user-center-cards.scss";</style>
