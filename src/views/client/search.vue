<template>
  <main class="search-page">
    <h1>搜索结果</h1>
    <el-input v-model.trim="keyword" placeholder="搜索失物或招领信息" class="search-input" @keyup.enter.native="search">
      <el-button slot="append" icon="el-icon-search" @click="search">搜索</el-button>
    </el-input>
    <el-skeleton v-if="loading" :rows="6" animated />
    <el-empty v-else-if="!items.length" :description="keyword ? '未找到相关信息' : '请输入关键词开始搜索'" />
    <div v-else class="result-list">
      <button v-for="item in items" :key="item.id" @click="$router.push(`/user/detail/${item.id}`)">
        <el-tag :type="item.infoType === 1 ? 'danger' : 'success'" size="mini">{{ item.infoType === 1 ? '失物' : '招领' }}</el-tag>
        <strong>{{ item.itemName }}</strong><span>{{ item.occurPlace || '地点待补充' }}</span><time>{{ date(item.createTime) }}</time>
      </button>
    </div>
    <pagination v-if="keyword" :total="total" :current-page.sync="page.current" :page-size.sync="page.size" @pagination="loadData" />
  </main>
</template>

<script>
import Pagination from '@/components/Pagination'
import { pagePublicLostFound } from '@/api/public'
export default {
  name: 'ClientSearch', components: { Pagination },
  data() { return { keyword: this.$route.query.keyword || '', loading: false, items: [], total: 0, page: { current: 1, size: 10 } } },
  watch: { '$route.query.keyword'(value) { this.keyword = value || ''; this.search() } },
  created() { if (this.keyword) this.loadData() },
  methods: {
    async loadData() { this.loading = true; try { const res = await pagePublicLostFound(this.page.current, this.page.size, { itemName: this.keyword }); this.items = res.data.records || []; this.total = res.data.total || 0 } finally { this.loading = false } },
    search() { this.page.current = 1; this.$router.replace({ query: this.keyword ? { keyword: this.keyword } : {} }); if (this.keyword) this.loadData(); else this.items = [] },
    date(v) { return v ? String(v).slice(0, 10) : '' }
  }
}
</script>

<style scoped>
.search-page{max-width:960px;margin:0 auto;padding:28px 20px 45px}.search-input{margin:16px 0 24px}.result-list{border:1px solid #e2e8f0;border-radius:10px;overflow:hidden}.result-list button{display:grid;grid-template-columns:65px 1fr 180px 110px;align-items:center;gap:12px;width:100%;padding:15px;border:0;border-bottom:1px solid #eef2f7;background:#fff;text-align:left;cursor:pointer}.result-list button:last-child{border-bottom:0}.result-list strong{color:#334155}.result-list span,.result-list time{color:#64748b;font-size:13px}@media(max-width:700px){.result-list button{grid-template-columns:65px 1fr;}.result-list span,.result-list time{display:none}}
</style>
