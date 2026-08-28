import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* 布局组件 */
import Layout from '@/layout'


/**
 * 常量路由
 * 不需要权限的基础页面
 * 所有角色都可以访问
 */
export const constantRoutes = [
  // 用户相关
  {
    path: '/',
    redirect: '/user/home',
    hidden: true
  },
  {
    path: '/user/login',
    component: () => import('@/views/client/login'),
    hidden: true,
    meta: {
      appType: 'client',
      requiresAuth: false
    }
  },
  {
    path: '/user/register',
    component: () => import('@/views/client/register'),
    hidden: true,
    meta: {
      appType: 'client',
      requiresAuth: false
    }
  },
  // 管理员相关
  {
    // 管理员登录
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    // 管理员首页
    path: '/index',
    component: Layout,
    children: [
      {
        path: '',
        name: '首页',
        component: () => import('@/views/index/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
]

/**
 * 异步路由
 * 需要根据角色动态添加的路由
 */
export const asyncRoutes = [
  {
    path: '/infoManage', name: 'InfoManage', component: Layout, redirect: '/lostItemInfoManage/index',
    meta: { title: '信息管理', icon: 'el-icon-folder-opened', roles: ['admin'] },
    children: [
      { path: '/lostItemInfoManage/index', name: 'LostItemInfoManageIndex', component: () => import('@/views/views/lostItemInfoManage/index'), meta: { title: '失物信息', icon: 'el-icon-search', roles: ['admin'] } },
      { path: '/claimInfoManage/index', name: 'ClaimInfoManageIndex', component: () => import('@/views/views/claimInfoManage/index'), meta: { title: '招领信息', icon: 'el-icon-box', roles: ['admin'] } },
      { path: '/infoAuditManage/index', name: 'InfoAuditManageIndex', component: () => import('@/views/views/infoAuditManage/index'), meta: { title: '信息审核', icon: 'el-icon-finished', roles: ['admin'] } }
    ]
  },
  {
    path: '/contentManage', name: 'ContentManage', component: Layout, redirect: '/noticeInfoManage/index',
    meta: { title: '内容管理', icon: 'el-icon-document', roles: ['admin'] },
    children: [
      { path: '/noticeInfoManage/index', name: 'NoticeInfoManageIndex', component: () => import('@/views/views/noticeInfoManage/index'), meta: { title: '公告管理', icon: 'el-icon-bell', roles: ['admin'] } }
    ]
  },
  {
    path: '/auditCenter', name: 'AuditCenter', component: Layout, redirect: '/auditorLostItemInfoAudit/index',
    meta: { title: '审核中心', icon: 'el-icon-document-checked', roles: ['auditor'] },
    children: [
      { path: '/auditorLostItemInfoAudit/index', name: 'AuditorLostItemInfoAuditIndex', component: () => import('@/views/views/auditorLostItemInfoAudit/index'), meta: { title: '失物审核', icon: 'el-icon-search', roles: ['auditor'] } },
      { path: '/claimInfoAudit/index', name: 'ClaimInfoAuditIndex', component: () => import('@/views/views/claimInfoAudit/index'), meta: { title: '招领审核', icon: 'el-icon-circle-check', roles: ['auditor'] } }
    ]
  }
]

asyncRoutes.push({
  path: '/bannerManage',
  name: 'BannerManage',
  component: Layout,
  meta: { title: '页面配置', icon: 'el-icon-setting', roles: ['admin'] },
  redirect: '/bannerManage/index',
  children: [{
    path: '/bannerManage/index',
    name: 'BannerManageIndex',
    component: () => import('@/views/views/bannerManage'),
    meta: { title: '轮播图', icon: 'el-icon-picture-outline', roles: ['admin'] }
  }]
})

asyncRoutes.push({
  path: '/studentUserManage',
  name: 'StudentUserManage',
  component: Layout,
  meta: { title: '用户管理', icon: 'el-icon-user', roles: ['admin'] },
  redirect: '/studentUserManage/index',
  children: [{
    path: '/studentUserManage/index',
    name: 'StudentUserManageIndex',
    component: () => import('@/views/views/studentUserManage'),
    meta: { title: '用户管理', icon: 'el-icon-user', roles: ['admin'] }
  }]
})

asyncRoutes.push({
  path: '/itemCategoryManage',
  name: 'ItemCategoryManage',
  component: Layout,
  meta: { title: '分类管理', icon: 'el-icon-collection-tag', roles: ['admin'] },
  redirect: '/itemCategoryManage/index',
  children: [{
    path: '/itemCategoryManage/index',
    name: 'ItemCategoryManageIndex',
    component: () => import('@/views/views/itemCategoryManage'),
    meta: { title: '物品分类', icon: 'el-icon-collection-tag', roles: ['admin'] }
  }]
})

asyncRoutes.push({
  path: '/interactionManage',
  name: 'InteractionManage',
  component: Layout,
  redirect: '/interactionManage/reports',
  meta: { title: '互动管理', icon: 'el-icon-chat-line-square', roles: ['admin'] },
  children: [
    {
      path: '/interactionManage/reports',
      name: 'InfoReportManage',
      component: () => import('@/views/views/infoReportManage/index'),
      meta: { title: '举报管理', icon: 'el-icon-warning-outline', roles: ['admin'] }
    },
    {
      path: '/interactionManage/messages',
      name: 'InfoMessageManage',
      component: () => import('@/views/views/infoMessageManage/index'),
      meta: { title: '留言管理', icon: 'el-icon-chat-dot-round', roles: ['admin'] }
    }
  ]
})

/**
 * 用户端路由
 * 统一挂在用户端布局 @/layout/client 下，meta.appType 固定为 'client'，
 * 由 permission.js 按 appType 走独立的用户端鉴权流程。
 * meta.requiresAuth 控制是否需要登录后才能访问。
 */
export const clientAsyncRoutes = [
  {
    path: '/user',
    component: () => import('@/layout/client'),
    redirect: '/user/home',
    hidden: true,
    meta: { appType: 'client' },
    children: [
      {
        path: 'home',
        name: 'ClientHome',
        component: () => import('@/views/client/home'),
        meta: { title: '首页', appType: 'client', requiresAuth: false, showInHeader: true }
      },
      {
        path: 'lost-hall',
        name: 'ClientLostHall',
        component: () => import('@/views/client/hall'),
        meta: { title: '失物大厅', appType: 'client', requiresAuth: false, showInHeader: true, infoType: 1 }
      },
      {
        path: 'found-hall',
        name: 'ClientFoundHall',
        component: () => import('@/views/client/hall'),
        meta: { title: '招领大厅', appType: 'client', requiresAuth: false, showInHeader: true, infoType: 2 }
      },
      {
        path: 'search',
        name: 'ClientSearch',
        component: () => import('@/views/client/search'),
        meta: { title: '搜索结果', appType: 'client', requiresAuth: false }
      },
      {
        path: 'detail/:id',
        name: 'ClientDetail',
        component: () => import('@/views/client/detail'),
        meta: { title: '信息详情', appType: 'client', requiresAuth: false }
      },
      {
        path: 'notices',
        name: 'ClientNotices',
        component: () => import('@/views/client/notices'),
        meta: { title: '校园公告', appType: 'client', requiresAuth: false }
      },
      {
        path: 'notices/:id',
        name: 'ClientNoticeDetail',
        component: () => import('@/views/client/notices/detail'),
        meta: { title: '公告详情', appType: 'client', requiresAuth: false }
      },
      {
        path: 'publish',
        name: 'ClientPublish',
        component: () => import('@/views/client/publish'),
        meta: { title: '发布', appType: 'client', requiresAuth: true, showInHeader: true }
      },
      {
        path: 'ai-match',
        name: 'ClientImageMatch',
        component: () => import('@/views/client/ai-match'),
        meta: { title: '图片匹配', appType: 'client', requiresAuth: true, showInHeader: true }
      },
      {
        path: 'my-publish',
        name: 'ClientMyPublish',
        component: () => import('@/views/client/my-publish'),
        meta: { title: '我的发布', appType: 'client', requiresAuth: true }
      },
      {
        path: 'my-claims',
        name: 'ClientMyClaims',
        component: () => import('@/views/client/my-claims'),
        meta: { title: '我的认领', appType: 'client', requiresAuth: true }
      },
      {
        path: 'received-claims',
        name: 'ClientReceivedClaims',
        component: () => import('@/views/client/my-claims'),
        meta: { title: '收到的认领', appType: 'client', requiresAuth: true }
      },
      {
        path: 'my-reports',
        name: 'ClientMyReports',
        component: () => import('@/views/client/my-reports'),
        meta: { title: '我的举报', appType: 'client', requiresAuth: true }
      },
      {
        path: 'my-messages',
        name: 'ClientMyMessages',
        component: () => import('@/views/client/my-messages'),
        meta: { title: '我的留言', appType: 'client', requiresAuth: true }
      },
      {
        path: 'profile',
        name: 'ClientProfile',
        component: () => import('@/views/client/profile'),
        meta: { title: '我的', appType: 'client', requiresAuth: true, showInHeader: true }
      }
    ]
  }
]

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRoutes, ...clientAsyncRoutes]
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}


/**
 * 根据角色添加路由
 * @param {Array} roles - 用户角色数组
 * @returns {Array} - 符合用户角色的可访问路由数组
 */
export function addRoutesByRoles(roles) {
  // 不能用 JSON 深拷贝，会把 component 的函数丢失，导致页面渲染失败
  function cloneRoutes(routes) {
    return routes.map(route => {
      const clonedRoute = {
        ...route,
        meta: route.meta ? { ...route.meta } : undefined
      }
      if (route.children) {
        clonedRoute.children = cloneRoutes(route.children)
      }
      return clonedRoute
    })
  }
  const routePool = cloneRoutes(asyncRoutes)
  // 递归过滤子路由
  function filterChildRoutes(children) {
    if (!children) return [];
    return children.filter(child => {
      let hasAccess = false;
      // 检查当前路由是否有可访问的角色
      if (child.meta && child.meta.roles) {
        hasAccess = roles.some(role => child.meta.roles.includes(role));
      } else {
        hasAccess = true;
      }

      // 递归处理子路由
      if (child.children) {
        const filteredChildren = filterChildRoutes(child.children);
        child.children = filteredChildren;
        // 如果当前路由没有直接访问权限，但子路由有，则认为该路由可访问
        hasAccess = hasAccess || filteredChildren.length > 0;
      }
      return hasAccess;
    });
  }
  const accessedRoutes = routePool.filter(route => {
    const filteredChildren = filterChildRoutes(route.children);
    route.children = filteredChildren;
    // 如果父路由有子路由，或者父路由自身有匹配的角色，则保留该父路由
    const hasRouteAccess = filteredChildren.length > 0;
    return hasRouteAccess;
  });
  // 动态添加可访问的路由到路由实例中
  router.addRoutes(accessedRoutes);
  // 返回符合用户角色的可访问路由数组
  return accessedRoutes;
}

export default router

