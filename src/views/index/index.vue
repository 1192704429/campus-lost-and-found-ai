<template>
  <div v-loading="loading" class="dashboard-container">
    <template v-if="isAdmin">
      <div class="welcome">
        <div>
          <h2>管理数据概览</h2>
          <p>你好，{{ name }}。以下为校园失物招领平台的实时统计。</p>
        </div>
        <el-tag type="success">管理员</el-tag>
      </div>

      <el-row :gutter="20" class="stat-row">
        <el-col v-for="card in statCards" :key="card.key" :xs="12" :sm="8" :lg="4">
          <el-card class="stat-card" shadow="hover">
            <div :class="['stat-icon', card.color]">
              <i :class="card.icon" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ overview[card.key] || 0 }}</div>
              <div class="stat-label">{{ card.label }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-alert
        v-if="loadError"
        title="部分统计数据加载失败，请稍后刷新"
        type="warning"
        show-icon
        :closable="false"
        class="load-alert"
      />

      <el-row :gutter="20" class="chart-row">
        <el-col :xs="24" :lg="14">
          <basic-line-chart name="近 30 天信息发布趋势" :data-list="publishTrend" />
        </el-col>
        <el-col :xs="24" :lg="10">
          <basic-pie-chart name="物品分类分布" :data-list="categoryStats" />
        </el-col>
      </el-row>

      <el-row :gutter="20" class="chart-row">
        <el-col :xs="24" :lg="10">
          <basic-pie-chart name="信息完成情况" :data-list="recoveryStats.chartData" />
        </el-col>
        <el-col :xs="24" :lg="14">
          <el-card class="recovery-card">
            <div slot="header" class="card-title">平台找回率</div>
            <el-progress
              type="dashboard"
              :percentage="recoveryRate"
              :width="190"
              :stroke-width="14"
              color="#67c23a"
            />
            <div class="recovery-summary">
              已完成 {{ recoveryStats.recovered || 0 }} 条，
              共统计 {{ recoveryStats.total || 0 }} 条已审核信息
            </div>
          </el-card>
        </el-col>
      </el-row>
    </template>

    <el-card v-else-if="isAuditor" class="auditor-card">
      <div class="auditor-content">
        <i class="el-icon-s-check auditor-icon" />
        <h2>信息审核工作台</h2>
        <p>审核员不展示管理统计，请从下方入口处理待审核信息。</p>
        <div>
          <el-button type="primary" @click="$router.push('/auditorLostItemInfoAudit/index')">
            进入失物信息审核
          </el-button>
          <el-button type="success" @click="$router.push('/claimInfoAudit/index')">
            进入招领信息审核
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BasicLineChart from '@/components/BasicLineChart'
import BasicPieChart from '@/components/BasicPieChart'
import {
  getDashboardOverview,
  getPublishTrend,
  getCategoryStats,
  getRecoveryStats
} from '@/api/dashboard'

export default {
  name: 'Dashboard',
  components: {
    BasicLineChart,
    BasicPieChart
  },
  computed: {
    ...mapGetters([
      'name',
      'role'
    ]),
    isAdmin() {
      return this.role === 'admin'
    },
    isAuditor() {
      return this.role === 'auditor'
    },
    recoveryRate() {
      const rate = Number(this.recoveryStats.recoveryRate || 0)
      return Math.max(0, Math.min(rate, 100))
    }
  },
  data() {
    return {
      loading: false,
      loadError: false,
      overview: {},
      publishTrend: [],
      categoryStats: [],
      recoveryStats: {
        total: 0,
        recovered: 0,
        unrecovered: 0,
        recoveryRate: 0,
        chartData: []
      },
      statCards: [
        { key: 'totalCount', label: '信息总数', icon: 'el-icon-document', color: 'blue' },
        { key: 'lostCount', label: '失物信息', icon: 'el-icon-search', color: 'orange' },
        { key: 'foundCount', label: '招领信息', icon: 'el-icon-box', color: 'green' },
        { key: 'pendingAuditCount', label: '待审核', icon: 'el-icon-time', color: 'red' },
        { key: 'recoveredCount', label: '已完成', icon: 'el-icon-circle-check', color: 'cyan' },
        { key: 'studentCount', label: '学生用户', icon: 'el-icon-user', color: 'purple' }
      ]
    }
  },
  created() {
    if (this.isAdmin) {
      this.loadDashboard()
    }
  },
  methods: {
    async loadDashboard() {
      this.loading = true
      this.loadError = false
      try {
        const [overview, trend, categories, recovery] = await Promise.all([
          getDashboardOverview(),
          getPublishTrend(30),
          getCategoryStats(),
          getRecoveryStats()
        ])
        this.overview = overview.data || {}
        this.publishTrend = trend.data || []
        this.categoryStats = categories.data || []
        this.recoveryStats = recovery.data || this.recoveryStats
      } catch (error) {
        this.loadError = true
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  min-height: calc(100vh - 84px);
  padding: 24px;
  background: #f5f7fa;
}

.welcome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  h2 {
    margin: 0 0 8px;
    color: #303133;
  }

  p {
    margin: 0;
    color: #909399;
  }
}

.stat-row {
  margin-bottom: 20px;
}

.stat-card {
  margin-bottom: 20px;

  ::v-deep .el-card__body {
    display: flex;
    align-items: center;
    padding: 20px 16px;
  }
}

.stat-icon {
  width: 52px;
  height: 52px;
  margin-right: 14px;
  border-radius: 10px;
  color: #fff;
  font-size: 26px;
  line-height: 52px;
  text-align: center;

  &.blue { background: #409eff; }
  &.orange { background: #e6a23c; }
  &.green { background: #67c23a; }
  &.red { background: #f56c6c; }
  &.cyan { background: #36cfc9; }
  &.purple { background: #9254de; }
}

.stat-content {
  min-width: 0;
}

.stat-value {
  color: #303133;
  font-size: 26px;
  font-weight: 600;
  line-height: 32px;
}

.stat-label {
  margin-top: 4px;
  color: #909399;
  font-size: 13px;
  white-space: nowrap;
}

.load-alert,
.chart-row {
  margin-bottom: 20px;
}

.card-title {
  font-size: 20px;
  font-weight: bold;
}

.recovery-card {
  text-align: center;

  ::v-deep .el-card__body {
    min-height: 480px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

.recovery-summary {
  margin-top: 20px;
  color: #606266;
}

.auditor-card {
  max-width: 760px;
  margin: 80px auto 0;
}

.auditor-content {
  padding: 45px 20px;
  text-align: center;

  h2 {
    margin: 16px 0 10px;
  }

  p {
    margin: 0 0 28px;
    color: #909399;
  }
}

.auditor-icon {
  color: #409eff;
  font-size: 64px;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }

  .auditor-content .el-button {
    display: block;
    width: 100%;
    margin: 10px 0 0;
  }
}
</style>
