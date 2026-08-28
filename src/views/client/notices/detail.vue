<template>
  <main class="notice-detail" v-loading="loading">
    <el-empty v-if="!loading && !notice" description="公告不存在或未发布" />
    <article v-else-if="notice">
      <el-page-header content="公告详情" @back="$router.go(-1)" />
      <h1>{{ notice.noticeTitle }}</h1>
      <p class="meta">{{ date(notice.createTime) }} · 浏览 {{ notice.viewCount || 0 }}</p>
      <img v-if="notice.coverImage" :src="notice.coverImage" :alt="notice.noticeTitle">
      <div class="content">{{ notice.noticeContent }}</div>
    </article>
  </main>
</template>
<script>
import { getPublicNotice } from '@/api/public'
export default { name: 'ClientNoticeDetail', data() { return { loading: true, notice: null } }, created() { this.loadData() }, methods: { async loadData() { try { const res = await getPublicNotice(this.$route.params.id); this.notice = res.data } catch (e) { this.notice = null } finally { this.loading = false } }, date(v) { return v ? String(v).slice(0, 16) : '' } } }
</script>
<style scoped>.notice-detail{max-width:880px;margin:0 auto;padding:28px 20px 45px}.notice-detail article{margin-top:24px;padding:28px;border:1px solid #e2e8f0;border-radius:12px;background:#fff}.notice-detail h1{color:#1e293b}.meta{color:#94a3b8}.notice-detail img{max-width:100%;margin:16px 0;border-radius:8px}.content{white-space:pre-wrap;color:#475569;line-height:1.9}</style>
