<template>
  <main class="messages">
    <div class="page-heading"><span class="heading-icon"><i class="el-icon-chat-line-square" /></span><div><h1>我的留言</h1><p>查看和管理你发表的留言</p></div></div>
    <el-skeleton v-if="loading" :rows="6" animated />
    <el-empty v-else-if="!items.length" description="你还没有发表过留言" />
    <div v-else class="feed-list"><article v-for="row in items" :key="row.id" class="feed-card"><span class="feed-icon"><i class="el-icon-chat-dot-round" /></span><div class="feed-content"><button class="related-link" @click="$router.push(`/user/detail/${row.infoId}`)">{{ row.itemName || `信息 #${row.infoId}` }}</button><p>{{ row.messageContent }}</p><div class="feed-footer"><time><i class="el-icon-time" /> {{ row.createTime }}</time><el-button type="text" class="danger" @click="remove(row)">删除留言</el-button></div></div></article></div>
  </main>
</template>

<script>
import { clientDeleteMessage, clientMyMessages } from '@/api/client-user'
export default {
  name: 'ClientMyMessages',
  data() { return { loading: true, items: [] } },
  created() { this.loadData() },
  methods: {
    async loadData() { this.loading = true; try { const res = await clientMyMessages(); this.items = res.data || [] } finally { this.loading = false } },
    async remove(row) {
      await this.$confirm('确认删除这条留言吗？', '提示', { type: 'warning' })
      await clientDeleteMessage(row.id)
      this.$message.success('留言已删除')
      this.loadData()
    }
  }
}
</script>

<style scoped lang="scss">@import "./user-center-cards.scss";</style>
