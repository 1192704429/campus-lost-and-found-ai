<template>
  <main class="claims">
    <div class="page-heading"><span class="heading-icon"><i class="el-icon-tickets" /></span><div><h1>{{ received ? '收到的认领申请' : '我的认领' }}</h1><p>{{ received ? '及时处理其他同学提交的认领申请' : '跟踪你的物品认领进度' }}</p></div></div>
    <el-skeleton v-if="loading" :rows="6" animated />
    <el-empty v-else-if="!items.length" :description="received ? '暂未收到认领申请' : '暂无认领记录'" />
    <div v-else class="claim-list">
      <article v-for="row in items" :key="row.id" class="claim-card">
        <el-image :src="row.coverImage" class="claim-cover" fit="cover" />
        <div class="claim-content"><div class="claim-title"><button @click="viewInfo(row)">{{ row.itemName || `信息 #${row.infoId}` }}</button><el-tag :type="tagType(row.claimStatus)" size="small">{{ labels[row.claimStatus] }}</el-tag></div>
        <div v-if="received" class="applicant"><i class="el-icon-user" /> {{ row.realName || '申请人' }}<span>{{ row.contactPhone }}</span></div>
        <p><b>认领说明：</b>{{ row.claimReason || '暂无说明' }}</p><p v-if="received && row.featureDescription"><b>特征说明：</b>{{ row.featureDescription }}</p>
        <div class="claim-footer"><time><i class="el-icon-time" /> {{ row.createTime }}</time><el-image v-if="received && row.proofImage" :src="row.proofImage" :preview-src-list="[row.proofImage]" class="proof" fit="cover" />
        <div class="card-actions">
        <el-button v-if="!received && row.claimStatus===0" type="text" @click="cancel(row)">撤销</el-button>
        <template v-if="received && row.claimStatus===0"><el-button type="text" @click="review(row,'approve')">同意</el-button><el-button type="text" @click="review(row,'reject')">拒绝</el-button></template>
        <el-button v-if="received && row.claimStatus===1" type="text" @click="review(row,'complete')">确认归还</el-button>
        </div></div></div>
      </article>
    </div>
  </main>
</template>
<script>
import { clientCancelClaim, clientMyClaims, clientReceivedClaims, clientReviewClaim } from '@/api/client-user'
export default {
  name: 'ClientClaims',
  computed: { received() { return this.$route.path.includes('received') } },
  watch: { '$route.path'() { this.load() } },
  data() { return { loading: false, items: [], labels: { 0: '待审核', 1: '已通过', 2: '已拒绝', 3: '已完成', 4: '已撤销' } } },
  created() { this.load() },
  methods: {
    async load() { this.loading = true; try { const res = await (this.received ? clientReceivedClaims() : clientMyClaims()); this.items = res.data || [] } finally { this.loading = false } },
    viewInfo(row) {
      const query = this.received ? { mine: '1' } : [1, 3].includes(row.claimStatus) ? { claim: '1' } : {}
      this.$router.push({ path: `/user/detail/${row.infoId}`, query })
    },
    tagType(v) { return ({ 0: 'warning', 1: 'primary', 2: 'danger', 3: 'success', 4: 'info' })[v] },
    async cancel(row) { await this.$confirm('确认撤销该申请吗？', '提示', { type: 'warning' }); await clientCancelClaim(row.id); this.load() },
    async review(row, action) {
      let reviewRemark = ''
      if (action === 'reject') { const r = await this.$prompt('请输入驳回意见', '驳回申请', { inputValidator: value => Boolean(value && value.trim()) || '驳回意见不能为空' }); reviewRemark = r.value }
      if (action === 'approve') await this.$confirm('确认同意该认领申请吗？其他待审核申请将自动拒绝。', '确认操作', { type: 'warning' })
      if (action === 'complete') await this.$confirm('确认物品已经归还申请人吗？', '确认归还', { type: 'warning' })
      await clientReviewClaim(row.id, action, { reviewRemark }); this.$message.success('操作成功'); this.load()
    }
  }
}
</script>
<style scoped lang="scss">@import "./user-center-cards.scss";</style>
