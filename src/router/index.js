import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['MANAGER','OPERATOR','ASSESSOR']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/init-pass',
    component: () => import('@/views/password/index'),
    hidden: true
  },

  {
    path: '/retrieve-pass',
    component: () => import('@/views/password/retrieve'),
    hidden: true
  },

  {
    path: '/pass',
    component: Layout,
    redirect: '/pass/update',
    hidden: true,
    children: [
      {
        path: 'update',
        component: () => import('@/views/password/index'),
        name: 'UpdatePassword',
        meta: { title: 'updatePassword', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/signature/dashboard',
    name: 'Signature',
    meta: {
      title: 'signature',
      icon: 'example'
    },
    children: [
      {
        path: '/signature/dashboard',
        name: 'SignatureDashboard',
        component: () => import('@/views/signature/index'),
        meta: { title: 'signatureDashboard' }
      },
      {
        path: '/signature/history',
        name: 'SignatureHistory',
        component: () => import('@/views/signature/history'),
        meta: { title: 'signatureHistory' }
      },
      {
        path: '/signature/cert-manage',
        name: 'CertificateManagement',
        component: () => import('@/views/signature/cert-manage'),
        meta: { title: 'certificateManagement', roles: ['MANAGER'] }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'UserManage',
    alwaysShow: true,
    meta: {
      title: 'userManage',
      icon: 'user'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/user/list'),
        name: 'UserList',
        meta: { title: 'userList', icon: 'list' }
      },
      {
        path: 'create',
        component: () => import('@/views/user/create'),
        name: 'CreateUser',
        meta: { title: 'createUser', activeMenu: '/user/list', roles: ['MANAGER'] },
        hidden: true
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/user/edit'),
        name: 'EditUser',
        meta: { title: 'editUser', noCache: true, activeMenu: '/user/list', roles: ['MANAGER'] },
        hidden: true
      },
      {
        path: 'audit-list',
        component: () => import('@/views/user/audit-list'),
        name: 'UserAuditList',
        meta: { title: '待审核列表', icon: 'list', roles: ['MANAGER'] }
      },
      {
        path: 'audit-detail/:id',
        component: () => import('@/views/user/audit-detail'),
        name: 'UserAuditDetail',
        meta: { title: '审核详情', noCache: true, activeMenu: '/user/audit-list', roles: ['MANAGER'] },
        hidden: true
      }
    ]
  },
  {
    path: '/access',
    component: Layout,
    redirect: '/access/list',
    name: 'Access',
    alwaysShow: true,
    meta: {
      title: '接入端管理',
      icon: 'example'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/access/list'),
        name: 'AccessList',
        meta: { title: '接入端列表', icon: 'list' }
      },
      {
        path: 'create',
        component: () => import('@/views/access/create'),
        name: 'CreateAccess',
        meta: { title: '增加接入端', activeMenu: '/access/list', roles: ['OPERATOR'] },
        hidden: true
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/access/edit'),
        name: 'EditAccess',
        meta: { title: '修改接入端', noCache: true, activeMenu: '/access/list', roles: ['OPERATOR'] },
        hidden: true
      },
      {
        path: 'audit-list',
        component: () => import('@/views/access/audit-list'),
        name: 'AccessAuditList',
        meta: { title: '待审核列表', icon: 'list', roles: ['ASSESSOR'] }
      },
      {
        path: 'audit-detail/:id',
        component: () => import('@/views/access/audit-detail'),
        name: 'AccessAuditDetail',
        meta: { title: '审核详情', noCache: true, activeMenu: '/access/audit-list', roles: ['ASSESSOR'] },
        hidden: true
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
