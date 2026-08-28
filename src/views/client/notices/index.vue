<template>
  <main class="notice-page">
    <h1>校园公告</h1>
    <el-skeleton v-if="loading" :rows="8" animated />
    <el-empty v-else-if="!notices.length" description="暂无已发布公告" />
    <div v-else class="notice-list">
      <button v-for="notice in notices" :key="notice.id" @click="$router.push(`/user/notices/${notice.id}`)">
        <el-tag v-if="notice.isTop === 1" size="mini" type="danger">置顶</el-tag><strong>{{ notice.noticeTitle }}</strong><time>{{ date(notice.createTime) }}</time>
      </button>
    </div>
    <pagination :total="total" :current-page.sync="page.current" :page-size.sync="page.size" @pagination="loadData" />
  </main>
</template>
<script>
import Pagination from '@/components/Pagination'
import { pagePublicNotice } from '@/api/public'
export default { name: 'ClientNotices', components: { Pagination }, data() { return { loading: true, notices: [], total: 0, page: { current: 1, size: 10 } } }, created() { this.loadData() }, methods: { async loadData() { this.loading = true; try { const res = await pagePublicNotice(this.page.current, this.page.size); this.notices = res.data.records || []; this.total = res.data.total || 0 } finally { this.loading = false } }, date(v) { return v ? String(v).slice(0, 10) : '' } } }
</script>
<style scoped>.notice-page{max-width:960px;margin:0 auto;padding:28px 20px 45px}.notice-list{overflow:hidden;border:1px solid #e2e8f0;border-radius:10px}.notice-list button{display:flex;align-items:center;gap:10px;width:100%;padding:16px;border:0;border-bottom:1px solid #eef2f7;background:#fff;text-align:left;cursor:pointer}.notice-list button:last-child{border-bottom:0}.notice-list strong{flex:1;color:#334155}.notice-list time{color:#94a3b8;font-size:13px}</style>
