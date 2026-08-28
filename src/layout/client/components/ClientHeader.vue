<template>
  <header class="client-header">
    <div class="header-inner">
      <div class="brand" @click="goHome">
        <img
          v-if="clientHeaderLogo"
          :src="clientHeaderLogo"
          alt="logo"
          class="logo-image"
        >
        <div v-else class="logo-placeholder">DS</div>
        <span class="title">{{ clientHeaderTitle }}</span>
      </div>

      <el-menu
        mode="horizontal"
        :default-active="activeMenu"
        class="nav-menu"
        @select="handleMenuSelect"
      >
        <el-menu-item
          v-for="item in menuRoutes"
          :key="item.path"
          :index="item.path"
          class="nav-item"
        >
          {{ item.meta.navTitle || item.meta.title || item.name }}
        </el-menu-item>
      </el-menu>

      <el-input
        v-model.trim="keyword"
        class="header-search"
        size="small"
        placeholder="搜索失物或招领信息"
        clearable
        @keyup.enter.native="handleSearch"
      >
        <i slot="suffix" class="el-icon-search search-icon" @click="handleSearch" />
      </el-input>

      <div class="user-area">
        <template v-if="isLoggedIn">
          <el-dropdown trigger="hover" @command="handleCommand">
            <div class="user-trigger">
              <img v-if="clientAvatar" :src="clientAvatar" alt="avatar" class="avatar-img">
              <div v-else class="avatar">{{ avatarText }}</div>
              <span class="username">{{ clientName || '用户' }}</span>
              <i class="el-icon-arrow-down el-icon--right" />
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="/user/profile">个人中心</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template v-else>
          <button class="entry-btn login-btn" @click="$router.push('/user/login')">登录</button>
          <button class="entry-btn register-btn" @click="$router.push('/user/register')">注册</button>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import { clientAsyncRoutes } from '@/router'
import defaultSettings from '@/settings'
import clientLogo from '@/assets/logo.png'

export default {
  name: 'ClientHeader',
  data() {
    return {
      keyword: ''
    }
  },
  computed: {
    clientHeaderTitle() {
      return defaultSettings.clientTitle || '校园失物招领'
    },
    clientHeaderLogo() {
      return defaultSettings.clientLogo || clientLogo
    },
    clientName() {
      return this.$store.getters.clientName
    },
    clientAvatar() {
      return this.$store.getters.clientAvatar
    },
    isLoggedIn() {
      return Boolean(this.$store.getters.clientToken)
    },
    activeMenu() {
      return this.$route.path
    },
    menuRoutes() {
      const staticUserRoot = clientAsyncRoutes.find(route => route.path === '/user')
      const optionsRoutes = this.$router.options.routes || []
      const runtimeUserRoot = optionsRoutes.find(route => route.path === '/user')
      const userRoot = staticUserRoot || runtimeUserRoot
      const children = (userRoot && userRoot.children) || []
      return children
        .map(route => ({
          ...route,
          path: route.path.startsWith('/user/') ? route.path : `/user/${route.path}`
        }))
        .filter(route => {
          const meta = route.meta || {}
          if (!meta.showInHeader) return false
          if (meta.requiresAuth && !this.isLoggedIn) return false
          return true
        })
    },
    avatarText() {
      if (!this.clientName) return 'U'
      return this.clientName.slice(0, 1).toUpperCase()
    }
  },
  methods: {
    handleSearch() {
      if (!this.keyword) return
      this.$router.push({ path: '/user/search', query: { keyword: this.keyword } })
    },
    handleMenuSelect(path) {
      if (path !== this.$route.path) {
        this.$router.push(path)
      }
    },
    async handleCommand(command) {
      if (command === 'logout') {
        await this.$store.dispatch('clientUser/logout')
        this.$router.replace('/user/login')
        return
      }
      this.$router.push(command)
    },
    goHome() {
      this.$router.push('/user/home')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../client-theme.scss";

.client-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 64px;
  background: linear-gradient(90deg, $client-header-bg-start 0%, $client-header-bg-end 100%);
  border-bottom: 1px solid rgba(220, 229, 239, 0.9);
  box-shadow: 0 4px 14px $client-header-shadow;
}

.header-inner {
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.logo-image,
.logo-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 10px;
}

.logo-image {
  object-fit: contain;
  mix-blend-mode: multiply;
}

.logo-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, $client-color-primary 0%, $client-color-accent 100%);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(29, 79, 145, 0.22);
}

.title {
  font-size: 19px;
  font-weight: 700;
  color: $client-header-title;
  letter-spacing: 0.5px;
}

.nav-menu.el-menu--horizontal {
  border-bottom: none;
  background-color: transparent;
}

.header-search {
  width: 210px;
  margin: 0 18px;
}

.header-search ::v-deep .el-input__inner {
  border-radius: 18px;
  border-color: $client-color-border;
  background: rgba(255, 255, 255, .92);
  transition: border-color .2s ease, box-shadow .2s ease;
}

.header-search ::v-deep .el-input__inner:focus {
  border-color: $client-color-primary-light;
  box-shadow: 0 0 0 3px rgba(29, 79, 145, .1);
}

.search-icon {
  line-height: 32px;
  cursor: pointer;
  color: $client-color-primary;
}

.nav-menu ::v-deep .el-menu-item {
  position: relative;
  height: 64px;
  line-height: 64px;
  color: $client-header-menu;
  background-color: transparent;
  border-bottom: none !important;
  transition: color 0.25s ease, transform 0.25s ease;
}

.nav-menu ::v-deep .el-menu-item:hover {
  color: $client-header-menu-hover !important;
  transform: translateY(-1px);
}

.nav-menu ::v-deep .el-menu-item::after {
  content: '';
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 8px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, $client-header-menu-line-start, $client-header-menu-line-end);
  transform: scaleX(0);
  transition: transform 0.25s ease;
}

.nav-menu ::v-deep .el-menu-item:hover::after,
.nav-menu ::v-deep .el-menu-item.is-active::after {
  transform: scaleX(1);
}

.nav-menu ::v-deep .el-menu-item.is-active {
  color: $client-header-menu-active !important;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 20px;
  transition: background-color 0.25s ease;
}

.user-trigger:hover {
  background-color: rgba(29, 79, 145, 0.08);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, $client-color-primary 0%, $client-color-accent 100%);
  color: #fff;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(24, 50, 79, 0.2);
}

.username {
  color: $client-color-text-main;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.entry-btn {
  border: none;
  outline: none;
  border-radius: 20px;
  padding: 7px 16px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.25s ease;
}

.login-btn {
  background: #ffffff;
  color: $client-color-primary;
  border: 1px solid $client-color-border;
}

.login-btn:hover {
  border-color: $client-color-primary-light;
  background: #eef5fc;
}

.register-btn {
  color: #ffffff;
  background: linear-gradient(135deg, $client-color-primary 0%, $client-color-accent 100%);
}

.register-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(29, 79, 145, 0.25);
}

@media (max-width: 900px) {
  .header-search { display: none; }
  .nav-menu ::v-deep .el-menu-item { padding: 0 10px; }
}
</style>
