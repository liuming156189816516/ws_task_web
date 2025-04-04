import Vue from 'vue'
import i18n from '@/locale'
import Router from 'vue-router'

Vue.use(Router)
/* Layout */
import Layout from '@/layout'

/* Router Modules */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/work-order-sharing',
    component: () => import('@/views/share/work-order-sharing'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/dashboard/index'),
        name: 'index',
        meta: { title:i18n.t('sys_m016'), icon: 'el-icon-odometer', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: 'user',
    children: [
      {
        hidden: true,
        path: '/user-info',
        component: () => import('@/views/user/user-info'),
        name: 'user-info',
        meta: { title:i18n.t('sys_m020'), icon: 'dashboard' }
      },
      {
        hidden: true,
        path: '/change-password',
        component: () => import('@/views/user/change-password'),
        name: 'change-password',
        meta: {
          title:i18n.t('sys_m021'),
          icon: 'dashboard'
        }
      }
    ]
  }
]
export const asyncRoutes = [
  {
    path: '/storeroom',
    component: Layout,
    name: 'storeroom',
    meta: { title:i18n.t('sys_m017'),icon: 'el-icon-user' },
    children: [
      {
        path: '/warehouse',
        component: () => import('@/views/storeroom/warehouse'),
        name: 'warehouse',
        meta: {
          title:i18n.t('sys_m018'),
        }
      },
      {
        path: '/whats-app-list',
        component: () => import('@/views/storeroom/whats-app-list'),
        name: 'whats-app-list',
        meta: {
          title:i18n.t('sys_m019'),
        }
      },
      {
        hidden: true,
        path: '/shunt-link-list',
        component: () => import('@/views/storeroom/shunt-link-list'),
        name: 'shunt-link-list',
        meta: {
          title: '分流链接列表',
        }
      },
      {
        hidden: true,
        path: '/share-link-manage',
        component: () => import('@/views/storeroom/link_manage'),
        name: 'share-link-manage',
        meta: {
          title: '分享链接管理',
        }
      },
      {
        hidden: true,
        path: '/shunt-link-detail',
        component: () => import('@/views/storeroom/shunt-link-detail'),
        name: 'shunt-link-detail',
        meta: {
          title: '分流链接详情',
        }
      },
      {
        hidden: true,
        path: '/shunt-allocation-details',
        component: () => import('@/views/storeroom/shunt-allocation-details'),
        name: 'shunt-allocation-details',
        meta: {
          title: '分配详情',
        }
      },
      {
        hidden: true,
        path: '/shunt-link-fans-detail',
        component: () => import('@/views/storeroom/shunt-link-fans-detail'),
        name: 'shunt-link-fans-detail',
        meta: {
          title: '进粉详情',
        }
      },
      {
        hidden: true,
        path: '/modify-wa-profile',
        component: () => import('@/views/storeroom/modify-wa-profile'),
        name: 'modify-wa-profile',
        meta: {
          title: '修改WS资料',
        }
      },
      {
        hidden: true,
        path: '/modify-wa-logs',
        component: () => import('@/views/storeroom/modify-wa-logs'),
        name: 'modify-wa-logs',
        meta: {
          title: '修改WS资料日志',
        }
      },
      {
        path: '/tg-app-list',
        component: () => import('@/views/storeroom/tg-app-list'),
        name: 'tg-app-list',
        meta: {
          title:i18n.t('sys_t001'),
        }
      },
      {
        path: '/tg_warehouse',
        component: () => import('@/views/storeroom/tg_warehouse'),
        name: 'tg_warehouse',
        meta: {
          title:i18n.t('sys_t002'),
        }
      }
    ]
  },
  {
    path: '/registerManage',
    component: Layout,
    name: 'registerManage',
    meta: { title:i18n.t('sys_m061'),icon: 'el-icon-s-custom' },
    children: [
      {
        path: '/user_list',
        component: () => import('@/views/registerManage/user_list'),
        name: 'user_list',
        meta: {
          title:i18n.t('sys_m062'),
        }
      },
      {
        path: '/task_details',
        component: () => import('@/views/registerManage/task_details'),
        name: 'task_details',
        meta: {
          title:i18n.t('sys_m063'),
        }
      },
      {
        path: '/running_details',
        component: () => import('@/views/registerManage/running_details'),
        name: 'running_details',
        meta: {
          title:i18n.t('sys_m064'),
        }
      },
      {
        path: '/user_statistics',
        component: () => import('@/views/registerManage/user_statistics'),
        name: 'user_statistics',
        meta: {
          title:i18n.t('sys_s007'),
        }
      },
      {
        path: '/taskConfig',
        component: () => import('@/views/registerManage/taskConfig'),
        name: 'taskConfig',
        meta: {
          title:i18n.t('sys_s002'),
        }
      }
    ]
  },
  {
    path: '/staff',
    component: Layout,
    name: 'staff',
    meta: { title:i18n.t('sys_m022'),icon: 'el-icon-service' },
    children: [
      {
        path: '/list',
        component: () => import('@/views/staff/list'),
        name: 'list',
        meta: {
          title:i18n.t('sys_m023'),
        }
      },
      {
        path: '/staff-data',
        component: () => import('@/views/staff/staff-data'),
        name: 'staff-data',
        meta: {
          title:i18n.t('sys_m024'),
        }
      },
      {
        hidden: true,
        path: '/chatroom',
        component: () => import('@/views/staff/chatroom'),
        name: 'chatroom',
        meta: {
          title:i18n.t('sys_m025'),
        }
      }
    ]
  },
  // {
  //   path: '/counterWorkOrder',
  //   component: Layout,
  //   name: 'counterWorkOrder',
  //   meta: { title:i18n.t('sys_m026'),icon: 'el-icon-setting' },
  //   children: [
  //     {
  //       path: '/counter-list',
  //       component: () => import('@/views/counterWorkOrder/counter-list'),
  //       name: 'counter-list',
  //       meta: {
  //         title:i18n.t('sys_m027'),
  //       }
  //     },
  //     {
  //       hidden: true,
  //       path: '/counter-account-allocation',
  //       component: () => import('@/views/counterWorkOrder/counter-account-allocation'),
  //       name: 'counter-account-allocation',
  //       meta: {
  //         title:i18n.t('sys_m028'),
  //       }
  //     },
  //     {
  //       hidden: true,
  //       path: '/fanDetails',
  //       component: () => import('@/views/counterWorkOrder/fanDetails'),
  //       name: 'fanDetails',
  //       meta: {
  //         title:i18n.t('sys_m029'),
  //       }
  //     },
  //     {
  //       hidden: true,
  //       path: '/ticket-details',
  //       component: () => import('@/views/counterWorkOrder/ticket-details'),
  //       name: 'ticket-details',
  //       meta: {
  //         title:i18n.t('sys_m030'),
  //       }
  //     }
  //   ]
  // },
  {
    path: '/task',
    component: Layout,
    name: 'task',
    meta: { title:i18n.t('sys_m031'),icon: 'el-icon-s-order' },
    children: [
      {
        path: '/whats-haveno-list',
        component: () => import('@/views/task/whats-haveno-list'),
        name: 'whats-haveno-list',
        meta: {
          title:i18n.t('sys_m032'),
        }
      },
      {
        path: '/whats-group-list',
        component: () => import('@/views/task/whats-group-list'),
        name: 'whats-group-list',
        meta: {
          title:i18n.t('sys_m033'),
        }
      },
      {
        hidden: true,
        path: '/create-was-task',
        component: () => import('@/views/task/create-was-task'),
        name: 'create-was-task',
        meta: {
          title:i18n.t('sys_g123'),
        }
      },
      {
        hidden: true,
        path: '/task-detail',
        component: () => import('@/views/task/task-detail'),
        name: 'task-detail',
        meta: {
          title:i18n.t('sys_m035'),
        }
      },
      {
        hidden: true,
        path: '/create-was-haveno',
        component: () => import('@/views/task/create-rais-task'),
        name: 'create-was-haveno',
        meta: {
          title:i18n.t('sys_m036'),
        }
      },
      {
        path: '/wa-pull-group',
        component: () => import('@/views/task/wa-pull-group'),
        name: 'wa-pull-group',
        meta: {
          title:i18n.t('sys_m116')+i18n.t('sys_q128')
        }
      },
      {
        path: '/tg-pull-group',
        component: () => import('@/views/task/tg-pull-group'),
        name: 'tg-pull-group',
        meta: {
          title:""
        }
      },
      {
        hidden: true,
        path: '/wa-add-group',
        component: () => import('@/views/task/wa-add-group'),
        name: 'wa-add-group',
        meta: {
          title: i18n.t('sys_m038')
        }
      },
      {
        hidden: true,
        path: '/wa-group-detail',
        component: () => import('@/views/task/wa-group-detail'),
        name: 'wa-group-detail',
        meta: {
          title: i18n.t('sys_m039'),
        }
      },
      {
        path: '/ws-group-task',
        component: () => import('@/views/task/ws-group-task'),
        name: 'ws-group-task',
        meta: {
          title: i18n.t('sys_m040'),
        }
      },
      {
        hidden: true,
        path: '/ws-add-group',
        component: () => import('@/views/task/ws-add-group'),
        name: 'ws-add-group',
        meta: {
          title:""
        }
      },
      {
        hidden: true,
        path: '/ws-group-detail',
        component: () => import('@/views/task/ws-group-detail'),
        name: 'ws-group-detail',
        meta: {
          title:""
        }
      },
      {
        path: '/pullGroup',
        component: () => import('@/views/task/pullGroup'),
        name: 'pullGroup',
        meta: {
          title:i18n.t('sys_m037')+i18n.t('sys_q129')
        }
      },
      {
        hidden: true,
        path: '/ws-creat-group',
        component: () => import('@/views/task/ws-add-b-group'),
        name: 'ws-creat-group',
        meta: {
          title:""
        }
      },
      {
        path: '/super-channel',
        component: () => import('@/views/task/super-channel'),
        name: 'super-channel',
        meta: {
          title:i18n.t('sys_rai123')
        }
      },
      {
        hidden: true,
        path: '/create-super-task',
        component: () => import('@/views/task/create-super-task'),
        name: 'create-super-task',
        meta: {
          title:""
        }
      },
      {
        hidden: true,
        path: '/lucky_details',
        component: () => import('@/views/registerManage/lucky_detail'),
        name: 'lucky_details',
        meta: {
          title:i18n.t('sys_m108')
        }
      },
      {
        path: '/group-task',
        component: () => import('@/views/task/ai-group-task'),
        name: 'group-task',
        meta: {
          title:i18n.t('sys_m117')
        }
      },
      {
        path: '/tg-task',
        component: () => import('@/views/task/tg-group-task'),
        name: 'tg-task',
        meta: {
          title:""
        }
      }
    ]
  },
  {
    path: '/data',
    component: Layout,
    name: 'data',
    meta: { title:i18n.t('sys_m041'),icon: 'el-icon-s-data' },
    children: [
      {
        path: '/wa-list',
        component: () => import('@/views/data/wa-list'),
        name: 'wa-list',
        meta: {
          title:""
        }
      }
    ]
  },
  {
    path: '/ipManage',
    component: Layout,
    name: 'ipManage',
    meta: { title:i18n.t('sys_m043'),icon: 'el-icon-cpu' },
    children: [
      {
        path: '/ipList',
        component: () => import('@/views/ipManage/ipList'),
        name: 'ipList',
        meta: {
          title:"",
        }
      }
      // {
      //   path: '/quickReply',
      //   component: () => import('@/views/content/quickReply'),
      //   name: 'quickReply',
      //   meta: {
      //     title: '话术管理',
      //   }
      // }
    ]
  },
  {
    path: '/content',
    component: Layout,
    name: 'content',
    meta: { title: i18n.t('sys_m045'),icon: 'el-icon-folder-opened'},
    children: [
      {
        path: '/material',
        component: () => import('@/views/content/material'),
        name: 'material',
        meta: {
          title:""
        }
      },
      // {
      //   path: '/quick-reply',
      //   component: () => import('@/views/content/quick-reply'),
      //   name: 'quick-reply',
      //   meta: {
      //     title: i18n.t('sys_m047'),
      //   }
      // },
      {
        hidden: true,
        path: '/add',
        component: () => import('@/views/content/add'),
        name: 'add',
        meta: {
          title: i18n.t('sys_m048')
        }
      }
    ]
  },
  {
    path: '/financeManage',
    component: Layout,
    name: 'financeManage',
    meta: { title:i18n.t('sys_p001'),icon: 'el-icon-tickets' },
    children: [
      {
        path: '/pay_approval',
        component: () => import('@/views/financeManage/pay_approval'),
        name: 'pay_approval',
        meta: {
          title:i18n.t('sys_p002'),
        }
      },
      {
        path: '/manual_correction',
        component: () => import('@/views/financeManage/manual_correction'),
        name: 'manual_correction',
        meta: {
          title:i18n.t('sys_m077'),
        }
      },
      {
        path: '/user_bank',
        component: () => import('@/views/financeManage/user_bank'),
        name: 'user_bank',
        meta: {
          title:i18n.t('sys_m126'),
        }
      }
    ]
  },
  {
    path: '/bannerManage',
    component: Layout,
    name: 'bannerManage',
    meta: { title:i18n.t('sys_q138'),icon: 'el-icon-picture-outline' },
    children: [
      {
        path: '/bannerList',
        component: () => import('@/views/bannerManage/bannerList'),
        name: 'bannerList',
        meta: {
          title:i18n.t('sys_q139'),
        }
      },
      {
        path: '/sysMessage',
        component: () => import('@/views/bannerManage/sysMessage'),
        name: 'sysMessage',
        meta: {
          title:i18n.t('sys_q046'),
        }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    name: 'permission',
    meta: {
      title: i18n.t('sys_m049'),
      icon: 'lock',
    },
    children: [
      {
        path: '/userManage',
        component: () => import('@/views/permission/userManage'),
        name: 'userManage',
        meta: {
          title: i18n.t('sys_m050'),
        }
      },
      {
        path: '/roleManage',
        component: () => import('@/views/permission/roleManage'),
        name: 'roleManage',
        meta: {
          title: i18n.t('sys_m051'),
        }
      },
      {
        path: '/menuManage',
        component: () => import('@/views/permission/menuManage'),
        name: 'menuManage',
        meta: {
          title: i18n.t('sys_m052')
        }
      },
      {
        path: '/baseConfig',
        component: () => import('@/views/permission/baseConfig'),
        name: 'baseConfig',
        meta: {
          title: i18n.t('sys_s001')
        }
      },
      {
        path: '/userDataManage',
        component: () => import('@/views/permission/userDataManage'),
        name: 'userDataManage',
        meta: {
          title: i18n.t('sys_s008')
        }
      },
      {
        hidden: true,
        path: '/userDataDetail',
        component: () => import('@/views/permission/userDataDetail'),
        name: 'userDataDetail',
        meta: {
          title: i18n.t('sys_s009')
        }
      }
      // {
      //   path: '/logManage',
      //   component: () => import('@/views/permission/logManage'),
      //   name: 'logManage',
      //   meta: {
      //     title: '日志管理'
      //   }
      // },
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
