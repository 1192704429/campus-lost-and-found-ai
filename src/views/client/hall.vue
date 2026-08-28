<template>
  <main class="client-content">
    <div class="page-heading">
      <div class="heading-icon"><i :class="type === 1 ? 'el-icon-search' : 'el-icon-present'" /></div>
      <div><h1>{{ title }}</h1><p>{{ subtitle }}</p></div>
    </div>
    <el-form :inline="true" :model="query" class="filter-bar" @submit.native.prevent>
      <el-form-item label="关键词"><el-input v-model.trim="query.itemName" clearable placeholder="物品名称或地点" @keyup.enter.native="search" /></el-form-item>
      <el-form-item label="分类">
        <el-select v-model="query.categoryId" clearable placeholder="全部分类"><el-option v-for="item in categories" :key="item.id" :label="item.categoryName" :value="item.id" /></el-select>
      </el-form-item>
      <el-form-item label="地点"><el-input v-model.trim="query.occurPlace" clearable placeholder="丢失/拾取地点" /></el-form-item>
      <el-button type="primary" @click="search">查询</el-button><el-button @click="reset">重置</el-button>
    </el-form>
    <el-skeleton v-if="loading" :rows="8" animated />
    <el-empty v-else-if="!items.length" description="暂无相关信息" />
    <div v-else class="cards">
      <article v-for="item in items" :key="item.id" class="card" @click="$router.push(`/user/detail/${item.id}`)">
        <div class="card-cover">
          <img v-if="hasImage(item)" :src="item.coverImage" :alt="item.itemName" @error="imageError(item.id)">
          <div v-else class="image-empty">
            <span class="empty-icon"><i :class="type === 1 ? 'el-icon-search' : 'el-icon-present'" /></span>
            <strong>{{ type === 1 ? '等待线索' : '等待认领' }}</strong>
            <small>暂无物品图片</small>
          </div>
          <span class="type-badge" :class="type === 1 ? 'lost' : 'found'">{{ type === 1 ? '失物' : '招领' }}</span>
        </div>
        <div class="card-body">
          <h3>{{ item.itemName }}</h3>
          <p class="info-line"><span class="line-icon"><i class="el-icon-location-outline" /></span><span>{{ item.occurPlace || '地点待补充' }}</span></p>
          <p class="info-line"><span class="line-icon"><i class="el-icon-time" /></span><span>{{ date(item.occurDate) }}</span></p>
          <div class="meta"><span class="category">{{ item.categoryName || '其他物品' }}</span><span><i class="el-icon-view" /> {{ item.viewCount || 0 }}</span></div>
        </div>
      </article>
    </div>
    <pagination :total="total" :current-page.sync="page.current" :page-size.sync="page.size" :page-sizes="[8, 16, 32]" @pagination="loadData" />
  </main>
</template>

<script>
import Pagination from '@/components/Pagination'
import { listPublicCategories, pagePublicLostFound } from '@/api/public'

export default {
  name: 'ClientHall',
  components: { Pagination },
  computed: {
    type() { return Number(this.$route.meta.infoType) },
    title() { return this.type === 1 ? '失物大厅' : '招领大厅' },
    subtitle() { return this.type === 1 ? '浏览校园内正在寻找的失物信息' : '浏览等待认领的招领信息' }
  },
  data() {
    return { loading: true, items: [], total: 0, categories: [], brokenImages: {}, query: { itemName: '', categoryId: '', occurPlace: '' }, page: { current: 1, size: 8 } }
  },
  watch: {
    '$route.meta.infoType'() { this.reset() },
    '$route.query.sort'() { this.page.current = 1; this.loadData() }
  },
  created() { this.loadCategories(); this.loadData() },
  methods: {
    async loadCategories() { const res = await listPublicCategories(); this.categories = res.data || [] },
    async loadData() {
      this.loading = true
      try {
        const res = await pagePublicLostFound(this.page.current, this.page.size, { ...this.query, infoType: this.type }, this.$route.query.sort || 'latest')
        this.items = res.data.records || []; this.total = res.data.total || 0
      } finally { this.loading = false }
    },
    search() { this.page.current = 1; this.loadData() },
    reset() { this.query = { itemName: '', categoryId: '', occurPlace: '' }; this.search() },
    hasImage(item) { return Boolean(item.coverImage) && !this.brokenImages[item.id] },
    imageError(id) { this.$set(this.brokenImages, id, true) },
    date(value) { return value ? String(value).slice(0, 10) : '时间待补充' }
  }
}
</script>

<style lang="scss" scoped>
.client-content { max-width: 1200px; margin: 0 auto; padding: 36px 20px 60px; }
.page-heading { display:flex; align-items:center; gap:15px; margin-bottom:24px; }
.heading-icon { display:flex; width:52px; height:52px; align-items:center; justify-content:center; flex:none; border-radius:16px; color:#fff; background:linear-gradient(135deg,#315f91,#4b82ba); font-size:23px; box-shadow:0 9px 20px rgba(49,95,145,.2); }
.page-heading h1 { margin: 0; color: #1d2f43; font-size:28px; } .page-heading p { margin:7px 0 0; color: #7b8da1; }
.filter-bar { margin-bottom:24px; padding:18px 20px 0; border:1px solid #e6edf5; border-radius:16px; background:#fff; box-shadow:0 5px 18px rgba(34,61,89,.045); }
.cards { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 22px; }
.card { min-width:0; overflow:hidden; border:1px solid #e1eaf3; border-radius:18px; cursor:pointer; transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease; background:#fff; box-shadow:0 7px 22px rgba(24,50,79,.065); }
.card:hover { transform:translateY(-5px); border-color:#c6d8ea; box-shadow:0 16px 34px rgba(24,50,79,.14); }
.card-cover { position:relative; height:180px; overflow:hidden; background:#edf3f8; }
.card-cover img,.image-empty { width:100%; height:100%; }
.card-cover img { display:block; object-fit:cover; transition:transform .35s ease; }
.card:hover .card-cover img { transform:scale(1.035); }
.image-empty { display:flex; flex-direction:column; justify-content:center; align-items:center; color:#71869a; background:linear-gradient(145deg,#edf4f9,#f8fbfd); }
.image-empty:before,.image-empty:after { content:''; position:absolute; border-radius:50%; background:rgba(79,130,180,.07); }
.image-empty:before { width:130px; height:130px; right:-38px; top:-55px; }.image-empty:after { width:90px; height:90px; left:-28px; bottom:-42px; }
.empty-icon { display:flex; width:48px; height:48px; align-items:center; justify-content:center; margin-bottom:9px; border-radius:15px; color:#4778a7; background:#fff; font-size:22px; box-shadow:0 7px 18px rgba(49,95,145,.12); }
.image-empty strong { font-size:14px; font-weight:600; }.image-empty small { margin-top:4px; color:#9aabba; font-size:12px; }
.type-badge { position:absolute; top:14px; right:14px; padding:5px 10px; border-radius:20px; color:#fff; font-size:12px; font-weight:600; box-shadow:0 4px 12px rgba(0,0,0,.12); }
.type-badge.lost { background:#e76d67; }.type-badge.found { background:#36a77b; }
.card-body { padding:17px 18px 16px; }
.card h3 { overflow:hidden; margin:0 0 14px; color:#21364b; font-size:17px; line-height:24px; text-overflow:ellipsis; white-space:nowrap; }
.info-line { display:flex; align-items:center; gap:8px; overflow:hidden; margin:8px 0; color:#718397; font-size:13px; white-space:nowrap; }
.info-line>span:last-child { overflow:hidden; text-overflow:ellipsis; }.line-icon { display:flex; width:22px; height:22px; align-items:center; justify-content:center; flex:none; border-radius:7px; color:#4778a7; background:#edf4fa; }
.meta { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:15px; padding-top:13px; border-top:1px solid #edf1f5; color:#8494a5; font-size:12px; }
.category { max-width:70%; overflow:hidden; padding:4px 9px; border-radius:12px; color:#536f8b; background:#f1f5f9; text-overflow:ellipsis; white-space:nowrap; }
@media (max-width: 1020px) { .cards { grid-template-columns: repeat(3, minmax(0,1fr)); } }
@media (max-width: 760px) { .cards { grid-template-columns: repeat(2, minmax(0,1fr)); gap:14px; }.card-cover{height:165px} }
@media (max-width: 600px) { .cards { grid-template-columns: 1fr; } }
</style>
