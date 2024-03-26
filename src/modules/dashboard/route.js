import AppLayout from '@/layout/AppLayout.vue'

const moduleRoutes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '/',
        name: 'dashboard',
        component: () => import('@/modules/dashboard/Index.vue'),
        meta: {
          subject: 'Dashboard',
          action: 'index',
          auth: true,
          title: 'Dashboard'
        }
      }
    ]
  }
]

export default moduleRoutes
