<template>
  <main class="home-page">
    <section v-if="banners.length" class="banner-section">
      <el-carousel height="300px" :interval="5000" arrow="always">
        <el-carousel-item v-for="banner in banners" :key="banner.id" class="banner-item">
          <img :src="banner.imageUrl" :alt="banner.title" class="banner-image">
          <div class="banner-content">
            <h1>{{ banner.title }}</h1>
            <p v-if="banner.description">{{ banner.description }}</p>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <section class="quick-section content-section">
      <div class="section-heading">
        <h2>快捷服务</h2>
        <p>让每一件遗失的物品尽快回到主人身边</p>
      </div>
      <div class="quick-grid">
        <button v-for="entry in quickEntries" :key="entry.title" class="quick-card" @click="goTo(entry.path)">
          <i :class="entry.icon" />
          <span>{{ entry.title }}</span>
          <small>{{ entry.description }}</small>
        </button>
      </div>
    </section>

    <section class="content-section notice-section">
      <div class="section-title">
        <div><span class="section-mark" /><h2>校园公告</h2></div>
        <el-button type="text" @click="goTo('/user/notices')">查看更多 <i class="el-icon-arrow-right" /></el-button>
      </div>
      <el-skeleton v-if="loading" :rows="3" animated />
      <el-empty v-else-if="!notices.length" description="暂无校园公告" :image-size="70" />
      <div v-else class="notice-list">
        <button v-for="notice in notices" :key="notice.id" class="notice-item" @click="goTo(`/user/notices/${notice.id}`)">
          <div class="notice-main">
            <el-tag v-if="notice.isTop === 1" size="mini" type="danger">置顶</el-tag>
            <strong>{{ notice.noticeTitle }}</strong>
          </div>
          <time>{{ formatDate(notice.createTime) }}</time>
        </button>
      </div>
    </section>

    <section v-for="section in itemSections" :key="section.key" class="content-section recommendation-section" :class="`${section.key}-section`">
      <div class="section-title">
        <div>
          <span class="section-icon"><i :class="section.icon" /></span>
          <div class="section-copy"><h2>{{ section.title }}</h2><p>{{ section.subtitle }}</p></div>
        </div>
        <el-button type="text" @click="goTo(section.path)">查看更多 <i class="el-icon-arrow-right" /></el-button>
      </div>
      <el-skeleton v-if="loading" :rows="4" animated />
      <el-empty v-else-if="!section.items.length" :description="`暂无${section.title}`" :image-size="70" />
      <div v-else class="item-grid">
        <article v-for="item in section.items" :key="item.id" class="item-card" @click="goTo(`/user/detail/${item.id}`)">
          <div class="cover-wrap">
            <img v-if="hasImage(item)" :src="item.coverImage" :alt="item.itemName" class="cover-image" @error="imageError(item.id)">
            <div v-else class="cover-placeholder">
              <span class="placeholder-icon"><i :class="item.infoType === 1 ? 'el-icon-search' : 'el-icon-present'" /></span>
              <strong>{{ item.infoType === 1 ? '等待线索' : '等待认领' }}</strong>
              <small>暂无物品图片</small>
            </div>
            <span class="type-tag" :class="item.infoType === 1 ? 'lost-tag' : 'found-tag'">
              {{ item.infoType === 1 ? '失物' : '招领' }}
            </span>
          </div>
          <div class="item-info">
            <h3 :title="item.itemName">{{ item.itemName }}</h3>
            <p><i class="el-icon-location-outline" /> {{ item.occurPlace || '地点待补充' }}</p>
            <div class="item-meta">
              <span>{{ item.categoryName || '未分类' }}</span>
              <span>{{ formatDate(item.occurDate) }}</span>
            </div>
            <div class="item-meta">
              <span class="active-status"><i />{{ item.infoType === 1 ? '寻找中' : '待认领' }}</span>
              <span><i class="el-icon-view" /> {{ item.viewCount || 0 }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script>
import { listPublicBanner, listRecommendedLostFound, pagePublicNotice } from '@/api/public'

export default {
  name: 'ClientHome',
  data() {
    return {
      loading: true,
      banners: [],
      notices: [],
      lostRecommended: [],
      foundRecommended: [],
      brokenImages: {},
      quickEntries: [
        { title: '发布失物', description: '登记丢失物品', icon: 'el-icon-edit-outline', path: '/user/publish?type=1' },
        { title: '发布招领', description: '帮助物归原主', icon: 'el-icon-goods', path: '/user/publish?type=2' },
        { title: '图片匹配', description: '多图辅助寻物', icon: 'el-icon-camera', path: '/user/ai-match' },
        { title: '我的发布', description: '管理发布信息', icon: 'el-icon-document', path: '/user/my-publish' }
      ]
    }
  },
  computed: {
    itemSections() {
      return [
        { key: 'lost', title: '为你推荐的失物', subtitle: '根据你的浏览偏好，发现可能关注的失物', icon: 'el-icon-search', items: this.lostRecommended, path: '/user/lost-hall' },
        { key: 'found', title: '为你推荐的招领', subtitle: '这些物品正在等待它们的主人', icon: 'el-icon-present', items: this.foundRecommended, path: '/user/found-hall' }
      ]
    }
  },
  created() {
    this.loadHomeData()
  },
  methods: {
    async loadHomeData() {
      try {
        const [bannerRes, noticeRes, lostRes, foundRes] = await Promise.all([
          listPublicBanner(),
          pagePublicNotice(1, 5),
          listRecommendedLostFound(1, 8),
          listRecommendedLostFound(2, 8)
        ])
        this.banners = bannerRes.data || []
        this.notices = (noticeRes.data.records || []).sort((a, b) => (b.isTop || 0) - (a.isTop || 0))
        this.lostRecommended = lostRes.data || []
        this.foundRecommended = foundRes.data || []
      } catch (error) {
        console.error('加载首页数据失败', error)
      } finally {
        this.loading = false
      }
    },
    goTo(path) {
      if (!path) return
      if (/^https?:\/\//.test(path)) {
        window.open(path, '_blank', 'noopener')
        return
      }
      this.$router.push(path)
    },
    formatDate(value) {
      return value ? String(value).slice(0, 10) : ''
    },
    hasImage(item) { return Boolean(item.coverImage) && !this.brokenImages[item.id] },
    imageError(id) { this.$set(this.brokenImages, id, true) }
  }
}
</script>

<style lang="scss" scoped>
@import "../../layout/client/client-theme.scss";

.home-page {
  max-width: 1240px;
  margin: 0 auto;
  padding: 28px 20px 64px;
}

.banner-section {
  overflow: hidden;
  border-radius: 22px;
  border: 1px solid rgba(220, 229, 239, .75);
  box-shadow: 0 18px 50px rgba(24, 50, 79, .16);
}

.banner-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}

.banner-content {
  position: absolute;
  inset: 0;
  padding: 72px 56px;
  color: #fff;
  background: linear-gradient(90deg, rgba(16, 45, 75, .78), rgba(29, 79, 145, .18) 68%, transparent);
}

.banner-content h1 { margin: 0 0 12px; font-size: 32px; letter-spacing: 1px; text-shadow: 0 2px 10px rgba(0, 0, 0, .22); }
.banner-content p { margin: 0; font-size: 16px; }
.content-section { margin-top: 42px; }
.section-heading { text-align: center; margin-bottom: 24px; }
.section-heading h2, .section-title h2 { margin: 0; color: $client-color-text-main; }
.section-heading h2 { font-size: 25px; letter-spacing: 1px; }
.section-heading p { margin: 10px 0 0; color: $client-color-text-secondary; }
.section-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.section-title > div { display: flex; align-items: center; gap: 9px; }
.section-title ::v-deep .el-button--text { color: $client-color-primary; }
.section-icon { display: flex; width: 46px; height: 46px; align-items: center; justify-content: center; border-radius: 14px; color: #fff; background: linear-gradient(135deg, #315f91, #4c83bd); box-shadow: 0 8px 18px rgba(49, 95, 145, .2); font-size: 21px; }
.found-section .section-icon { background: linear-gradient(135deg, #2f7d69, #54a58f); box-shadow: 0 8px 18px rgba(47, 125, 105, .2); }
.section-copy { display: block !important; }
.section-copy h2 { font-size: 22px; }
.section-copy p { margin: 5px 0 0; color: #8a9aae; font-size: 13px; }
.quick-grid, .item-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.quick-section { padding: 30px 32px; border: 1px solid rgba(222, 230, 239, .8); border-radius: 20px; background: linear-gradient(135deg, rgba(255,255,255,.96), rgba(245,249,253,.96)); box-shadow: 0 10px 28px rgba(24, 50, 79, .06); }
.quick-card { border: 1px solid rgba(218, 227, 237, .9); border-radius: 16px; background: #fff; padding: 22px 12px; cursor: pointer; color: $client-color-text-main; transition: all .22s ease; box-shadow: 0 4px 12px rgba(24, 50, 79, .035); }
.quick-card:hover, .item-card:hover { transform: translateY(-5px); border-color: rgba(29, 79, 145, .28); box-shadow: 0 16px 30px rgba(24, 50, 79, .12); }
.quick-card i { display: flex; width: 54px; height: 54px; margin: 0 auto 13px; align-items: center; justify-content: center; border-radius: 17px; color: $client-color-primary; background: #eaf2fb; font-size: 26px; }
.quick-card:nth-child(2) i, .quick-card:nth-child(4) i { color: $client-color-accent; background: #e9f5f0; }
.quick-card span, .quick-card small { display: block; }
.quick-card small { margin-top: 6px; color: #94a3b8; }
.notice-section { padding: 24px 28px; border-radius: 18px; background: #fff; box-shadow: 0 10px 30px rgba(24, 50, 79, .07); }
.notice-list { border: 1px solid $client-color-border; border-radius: 12px; overflow: hidden; }
.notice-item { width: 100%; display: flex; justify-content: space-between; gap: 16px; border: 0; border-bottom: 1px solid #edf2f7; padding: 15px 17px; background: #fff; text-align: left; cursor: pointer; color: $client-color-text-main; transition: background .2s ease; }
.notice-item:hover { background: #f5f9fd; }
.notice-item:last-child { border-bottom: 0; }
.notice-main { display: flex; gap: 8px; align-items: center; overflow: hidden; }
.notice-main strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.notice-item time { flex: 0 0 auto; color: #94a3b8; font-size: 13px; }
.recommendation-section { padding: 28px; border-radius: 22px; background: linear-gradient(145deg, #f6f9fd, #eef4fa); }
.found-section { background: linear-gradient(145deg, #f5faf8, #edf7f3); }
.item-card { overflow: hidden; border: 1px solid rgba(216, 227, 238, .85); border-radius: 17px; background: #fff; cursor: pointer; transition: all .24s ease; box-shadow: 0 5px 16px rgba(24, 50, 79, .055); }
.cover-wrap { position: relative; height: 170px; background: #f1f5f9; overflow: hidden; }
.cover-image { width: 100%; height: 100%; object-fit: cover; }
.item-card:hover .cover-image { transform: scale(1.035); }
.cover-image { transition: transform .3s ease; }
.cover-placeholder { position:relative; display:flex; height:100%; flex-direction:column; align-items:center; justify-content:center; overflow:hidden; color:#71869a; background:linear-gradient(145deg,#edf4f9,#f8fbfd); }
.cover-placeholder:before,.cover-placeholder:after { content:''; position:absolute; border-radius:50%; background:rgba(79,130,180,.07); }
.cover-placeholder:before { width:120px; height:120px; right:-35px; top:-52px; }.cover-placeholder:after { width:80px; height:80px; left:-24px; bottom:-38px; }
.placeholder-icon { display:flex; width:46px; height:46px; align-items:center; justify-content:center; margin-bottom:8px; border-radius:14px; color:#4778a7; background:#fff; font-size:21px; box-shadow:0 7px 18px rgba(49,95,145,.12); }
.cover-placeholder strong { font-size:14px; font-weight:600; }.cover-placeholder small { margin-top:4px; color:#9aabba; font-size:12px; }
.type-tag { position: absolute; top: 12px; left: 12px; padding: 5px 11px; border-radius: 20px; color: #fff; font-size: 12px; font-weight: 600; box-shadow: 0 3px 10px rgba(0,0,0,.14); }
.lost-tag { background: #d9685b; }
.found-tag { background: #3d9079; }
.item-info { padding: 16px; }
.item-info h3 { overflow: hidden; margin: 0 0 9px; color: $client-color-text-main; font-size: 16px; text-overflow: ellipsis; white-space: nowrap; }
.item-info p, .item-meta { margin: 0; color: $client-color-text-secondary; font-size: 13px; }
.item-meta { display: flex; justify-content: space-between; margin-top: 11px; }
.active-status { display: inline-flex; align-items: center; gap: 5px; color: #557089; }
.active-status i { width: 6px; height: 6px; border-radius: 50%; background: #46a683; box-shadow: 0 0 0 3px rgba(70,166,131,.12); }
@media (max-width: 900px) { .quick-grid, .item-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 600px) { .home-page { padding: 16px 12px 36px; } .banner-section { border-radius: 16px; } .banner-content { padding: 48px 26px; } .banner-content h1 { font-size: 24px; } .quick-section, .notice-section, .recommendation-section { padding: 20px 16px; } .section-copy p { display: none; } .quick-grid, .item-grid { grid-template-columns: 1fr; } }
</style>
