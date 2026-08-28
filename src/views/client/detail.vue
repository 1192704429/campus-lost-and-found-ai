<template>
  <main class="detail-page" v-loading="loading">
    <el-empty v-if="!loading && !item" description="信息不存在或无权查看" />
    <template v-else-if="item">
      <el-page-header content="信息详情" @back="$router.go(-1)" />
      <section class="detail-card">
        <div class="gallery">
          <el-image v-if="activeImage" class="gallery-main" :src="activeImage" fit="cover" :preview-src-list="imageList"><div slot="error" class="gallery-empty"><i class="el-icon-picture-outline" /><span>暂无物品图片</span></div></el-image>
          <div v-else class="gallery-main gallery-empty"><i class="el-icon-picture-outline" /><span>暂无物品图片</span></div>
          <div v-if="imageList.length > 1" class="gallery-thumbs"><button v-for="(url,index) in imageList" :key="url+index" :class="{active:url===activeImage}" @click="activeImage=url"><img :src="url"><span>{{ index + 1 }}</span></button></div>
          <span v-if="imageList.length" class="photo-count"><i class="el-icon-picture" /> {{ imageList.length }} 张图片</span>
        </div>
        <div class="summary">
          <div class="title-row"><h1>{{ item.itemName }}</h1><el-tag :type="item.infoType === 1 ? 'danger' : 'success'">{{ item.infoType === 1 ? '失物信息' : '招领信息' }}</el-tag></div>
          <p><b>分类：</b>{{ item.categoryName || '未分类' }}</p><p><b>地点：</b>{{ item.occurPlace || '待补充' }}</p><p><b>发生时间：</b>{{ date(item.occurDate) }}</p>
          <p><b>发布时间：</b>{{ date(item.createTime) }}</p><p v-if="item.realName"><b>发布人：</b>{{ item.realName }}</p>
          <p><b>浏览：</b>{{ item.viewCount || 0 }} 次</p><p><b>状态：</b><el-tag size="mini" :type="statusType(item.publishStatus)">{{ statusLabel(item) }}</el-tag></p>
          <div class="attribute-grid"><div><span>颜色</span><strong>{{ item.itemColor || '未填写' }}</strong></div><div><span>品牌</span><strong>{{ item.itemBrand || '未填写' }}</strong></div><div><span>图片</span><strong>{{ imageList.length }} 张</strong></div><div><span>留言</span><strong>{{ item.messageCount || 0 }} 条</strong></div></div>
          <el-button v-if="canClaim" type="primary" :disabled="hasActiveClaim" @click="claimOpen = true">{{ hasActiveClaim ? claimStatusLabel(claimRecord.claimStatus) : '我要认领' }}</el-button>
        </div>
      </section>
      <section class="panel story-panel"><div class="panel-heading"><span><i class="el-icon-document" /></span><div><h2>物品详情</h2><small>发布者提供的物品描述与辨认线索</small></div></div><div class="description">{{ item.description || '发布者暂未补充详细描述。' }}</div><div v-if="item.itemFeatures" class="feature-box"><b><i class="el-icon-magic-stick" /> 显著特征</b><p>{{ item.itemFeatures }}</p></div><div class="detail-tags"><span v-if="item.itemColor"><i class="el-icon-brush" /> {{ item.itemColor }}</span><span v-if="item.itemBrand"><i class="el-icon-price-tag" /> {{ item.itemBrand }}</span><span><i class="el-icon-location-outline" /> {{ item.occurPlace || '地点待补充' }}</span></div></section>
      <section class="panel"><h2>联系发布人</h2><p>联系人：{{ item.contactName || '暂未提供' }}</p><p>联系方式：{{ item.contactPhone || item.contactMethod || '暂未提供' }}</p><p v-if="item.claimMethod">领取方式：{{ item.claimMethod }}</p><el-alert v-if="!isPrivateView" title="为保护隐私，联系方式已脱敏；请通过留言或认领流程联系发布者。" type="info" :closable="false" show-icon /></section>
      <section class="panel">
        <h2>在线留言</h2><el-input v-if="canMessage" v-model="messageText" type="textarea" :rows="2" placeholder="文明留言，帮助物归原主" /><el-button v-if="canMessage" type="primary" size="small" @click="postMessage">发表留言</el-button>
        <el-empty v-if="!messages.length" description="暂无留言" :image-size="60" />
        <div v-for="message in messages" :key="message.id" class="message-row"><el-avatar :size="34" :src="message.avatar" /><div><b>{{ message.realName || '校园用户' }}</b><p>{{ message.messageContent }}</p><small>{{ date(message.createTime) }}</small></div><el-button v-if="Number(message.studentId)===Number(clientId)" type="text" class="delete-message" @click="deleteMessage(message)">删除</el-button></div>
      </section>
      <section v-if="!isPrivateView" class="panel">
        <h2>{{ item.infoType === 1 ? '相似招领' : '相似失物' }}</h2>
        <div v-if="similarLoading" class="similar-loading"><i class="el-icon-loading" /><div><strong>正在进行图片智能匹配</strong><p>推荐结果稍后呈现，不影响查看当前信息</p></div></div>
        <el-empty v-else-if="!similarItems.length" :description="item.infoType === 1 ? '暂无相似招领信息' : '暂无相似失物信息'" :image-size="70" />
        <div v-else class="similar-grid"><article v-for="similar in similarItems" :key="similar.id" class="similar-card" @click="$router.push(`/user/detail/${similar.id}`)"><img v-if="similar.coverImage" :src="similar.coverImage"><div v-else class="similar-empty"><i class="el-icon-picture-outline" /></div><div><h3>{{ similar.itemName }}</h3><p>{{ similar.occurPlace || '地点待补充' }}</p><el-tag size="mini" type="success">匹配度 {{ percent(similar.matchScore) }}</el-tag></div></article></div>
      </section>
      <el-button v-if="isLoggedIn && !isPrivateView" type="text" class="report-btn" @click="reportOpen = true">举报此信息</el-button>
      <el-dialog title="提交认领申请" :visible.sync="claimOpen" width="520px"><el-form :model="claim" label-width="90px"><el-form-item label="认领说明"><el-input v-model="claim.claimReason" type="textarea" /></el-form-item><el-form-item label="物品特征"><el-input v-model="claim.featureDescription" type="textarea" /></el-form-item><el-form-item label="证明图片"><img-upload v-model="claim.proofImage" :limit="1" /></el-form-item><el-form-item label="联系电话"><el-input v-model="claim.contactPhone" /></el-form-item></el-form><div slot="footer"><el-button @click="claimOpen=false">取消</el-button><el-button type="primary" @click="submitClaim">提交</el-button></div></el-dialog>
      <el-dialog title="举报信息" :visible.sync="reportOpen" width="440px"><el-select v-model="reportType" class="full-width" placeholder="请选择举报类型"><el-option v-for="(label,key) in reportTypes" :key="key" :label="label" :value="Number(key)" /></el-select><el-input v-model="reportReason" class="report-reason" type="textarea" :rows="4" placeholder="请说明举报原因" /><div slot="footer"><el-button @click="reportOpen=false">取消</el-button><el-button type="danger" @click="submitReport">提交举报</el-button></div></el-dialog>
    </template>
  </main>
</template>

<script>
import ImagePreview from '@/components/ImagePreview'
import ImgUpload from '@/components/ImgUpload'
import { getPublicLostFound, getSimilarLostFound } from '@/api/public'
import { clientApplyClaim, clientClaimStatus, clientDeleteMessage, clientGetClaimInfo, clientGetMyLostFound, clientMessages, clientOwnerMessages, clientPostMessage, clientPostReport } from '@/api/client-user'
export default {
  name: 'ClientDetail', components: { ImagePreview, ImgUpload },
  data() { return { loading: true, similarLoading: false, item: null, claimOpen: false, reportOpen: false, reportType: 5, reportReason: '', reportTypes: { 1: '虚假信息', 2: '不良内容', 3: '联系方式异常', 4: '重复发布', 5: '其他' }, messages: [], similarItems: [], messageText: '', claimRecord: null, claim: { claimReason: '', featureDescription: '', proofImage: '', contactPhone: '' } } },
  computed: {
    images() { return this.item && (this.item.itemImages || this.item.coverImage) },
    imageList() { return this.images ? this.images.split(',').map(item => item.trim()).filter(Boolean) : [] },
    activeImage: {
      get() { return (this.item && this.item._activeImage) || this.imageList[0] || '' },
      set(value) { if (this.item) this.$set(this.item, '_activeImage', value) }
    },
    isLoggedIn() { return Boolean(this.$store.getters.clientToken) },
    clientId() { return this.$store.getters.clientId },
    isMine() { return this.$route.query.mine === '1' },
    isClaimView() { return this.$route.query.claim === '1' },
    isPrivateView() { return this.isMine || this.isClaimView },
    canClaim() { return this.item && this.item.infoType === 2 && this.item.publishStatus === 1 && this.isLoggedIn && !this.isPrivateView },
    hasActiveClaim() { return this.claimRecord && [0, 1].includes(this.claimRecord.claimStatus) },
    canMessage() { return this.isLoggedIn && !this.isClaimView && (!this.isMine || (this.item && this.item.auditStatus === 1 && this.item.publishStatus === 1)) }
  },
  created() { this.loadData() },
  methods: {
    async loadData() {
      this.loading = true
      try {
        const res = this.isMine ? await clientGetMyLostFound(this.$route.params.id) : this.isClaimView ? await clientGetClaimInfo(this.$route.params.id) : await getPublicLostFound(this.$route.params.id)
        this.item = res.data
        this.loading = false
        this.loadSecondaryData()
      } catch (e) { this.item = null; this.loading = false }
    },
    async loadSecondaryData() {
      const id = this.item.id
      const messagePromise = (this.isClaimView ? Promise.resolve({ data: [] }) : this.isMine ? clientOwnerMessages(id) : clientMessages(id))
        .then(res => { this.messages = res.data || [] }).catch(() => { this.messages = [] })
      if (!this.isPrivateView) this.loadSimilar(id)
      const claimPromise = this.canClaim ? clientClaimStatus(id).then(res => { this.claimRecord = res.data || null }).catch(() => {}) : Promise.resolve()
      await Promise.all([messagePromise, claimPromise])
    },
    async loadSimilar(id) {
      this.similarLoading = true
      try { const res = await getSimilarLostFound(id, 4); this.similarItems = res.data || [] }
      catch (e) { this.similarItems = [] }
      finally { this.similarLoading = false }
    },
    date(v) { return v ? String(v).slice(0, 16) : '时间待补充' },
    statusLabel(item) { return item.infoType === 1 ? ({ 0: '已关闭', 1: '寻找中', 2: '已匹配', 3: '已找到' })[item.publishStatus] : ({ 0: '已关闭', 1: '待认领', 2: '认领中', 3: '已归还' })[item.publishStatus] },
    statusType(v) { return ({ 0: 'info', 1: 'warning', 2: 'primary', 3: 'success' })[v] || 'info' },
    claimStatusLabel(v) { return ({ 0: '已申请认领', 1: '认领已通过', 2: '申请已拒绝', 3: '认领已完成', 4: '申请已撤销' })[v] || '已申请认领' },
    percent(v) { return `${Math.round(Number(v || 0) * 100)}%` },
    async submitClaim() { await clientApplyClaim({ ...this.claim, infoId: this.item.id }); this.$message.success('认领申请已提交'); this.claimOpen = false; const status = await clientClaimStatus(this.item.id); this.claimRecord = status.data },
    async postMessage() { if (!this.messageText.trim()) return; await clientPostMessage({ infoId: this.item.id, messageContent: this.messageText }); this.messageText = ''; const res = await clientMessages(this.item.id); this.messages = res.data || [] },
    async deleteMessage(message) { await this.$confirm('确认删除这条留言吗？', '提示'); await clientDeleteMessage(message.id); this.messages = this.messages.filter(item => item.id !== message.id) },
    async submitReport() { if (!this.reportReason.trim()) return this.$message.warning('请填写举报原因'); await clientPostReport({ infoId: this.item.id, reportType: this.reportType, reportReason: this.reportReason }); this.$message.success('举报已提交'); this.reportOpen = false; this.reportReason = '' }
  }
}
</script>

<style scoped>
.detail-page{max-width:1080px;margin:0 auto;padding:28px 20px 45px}.detail-card{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:24px;padding:24px;border:1px solid #e2e8f0;border-radius:12px;background:#fff}.title-row{display:flex;align-items:center;justify-content:space-between;gap:12px}.summary h1{margin:0;color:#1e293b}.summary p,.panel p{color:#475569;line-height:1.8}.panel{margin-top:20px;padding:20px 24px;border-radius:10px;background:#f8fafc}.panel h2{margin-top:0;color:#334155;font-size:18px}.panel>.el-button{margin-top:10px}.message-row{display:flex;position:relative;gap:12px;margin-top:14px;padding:12px;border-top:1px solid #e2e8f0}.message-row p{margin:4px 0}.message-row small{color:#94a3b8}.delete-message{position:absolute;right:5px;top:5px;color:#e11d48}.similar-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.similar-card{display:flex;gap:12px;padding:10px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;cursor:pointer}.similar-card img,.similar-empty{width:86px;height:76px;object-fit:cover;border-radius:6px}.similar-empty{display:flex;align-items:center;justify-content:center;background:#f1f5f9}.similar-card h3{margin:2px 0;font-size:15px}.similar-card p{margin:5px 0;font-size:12px}.report-btn{color:#e11d48}.full-width{width:100%}.report-reason{margin-top:14px}@media(max-width:700px){.detail-card{grid-template-columns:1fr}.images{min-height:200px}.similar-grid{grid-template-columns:1fr}}
.similar-loading{display:flex;align-items:center;gap:14px;min-height:88px;padding:16px;border:1px dashed #cfdae5;border-radius:10px;color:#688097;background:#fff}.similar-loading>i{color:#4779a8;font-size:28px}.similar-loading strong{color:#38536d}.similar-loading p{margin:5px 0 0;color:#92a1b0;font-size:13px}
.gallery{position:relative;min-width:0}.gallery-main{display:block;width:100%;height:360px;overflow:hidden;border-radius:14px;background:#edf3f7;box-shadow:0 8px 25px rgba(31,58,84,.12)}.gallery-main ::v-deep .el-image__inner{transition:transform .3s}.gallery-main:hover ::v-deep .el-image__inner{transform:scale(1.025)}.gallery-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;color:#92a4b5;font-size:42px}.gallery-empty span{margin-top:10px;font-size:13px}.gallery-thumbs{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:10px}.gallery-thumbs button{position:relative;height:62px;overflow:hidden;padding:0;border:2px solid transparent;border-radius:9px;background:#eef3f7;cursor:pointer}.gallery-thumbs button.active{border-color:#3c78ad;box-shadow:0 0 0 2px rgba(60,120,173,.12)}.gallery-thumbs img{width:100%;height:100%;object-fit:cover}.gallery-thumbs span{position:absolute;right:3px;bottom:3px;padding:1px 5px;border-radius:8px;color:#fff;background:rgba(20,44,66,.68);font-size:10px}.photo-count{position:absolute;top:12px;right:12px;padding:6px 10px;border-radius:15px;color:#fff;background:rgba(28,53,76,.75);font-size:12px}.attribute-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:18px 0}.attribute-grid>div{padding:11px 12px;border-radius:9px;background:#f3f7fa}.attribute-grid span{display:block;color:#91a0ae;font-size:11px}.attribute-grid strong{display:block;overflow:hidden;margin-top:4px;color:#38526a;font-size:14px;text-overflow:ellipsis;white-space:nowrap}.panel-heading{display:flex;align-items:center;gap:12px;margin-bottom:18px}.panel-heading>span{display:flex;width:40px;height:40px;align-items:center;justify-content:center;border-radius:12px;color:#3d75a7;background:#e6f0f8;font-size:18px}.panel-heading h2{margin:0}.panel-heading small{color:#98a6b4}.description{color:#465d72;line-height:1.95;white-space:pre-line}.feature-box{margin-top:18px;padding:16px 18px;border-left:4px solid #4b83b5;border-radius:8px;background:#fff}.feature-box b{color:#315f88}.feature-box p{margin:8px 0 0}.detail-tags{display:flex;gap:9px;flex-wrap:wrap;margin-top:17px}.detail-tags span{padding:7px 11px;border:1px solid #dce6ee;border-radius:14px;color:#637b90;background:#fff;font-size:12px}
</style>
