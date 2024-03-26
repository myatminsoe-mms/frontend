import AppLayout from '@/layout/AppLayout.vue'

const authRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/modules/auth/login/Login.vue'),
    meta: { redirectIfLoggedIn: true }
  },
  {
    path: '/profile',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'profile',
        component: () => import('@/modules/auth/profile/Profile.vue'),
        meta: {
          auth: true,
          title: 'Profile'
        }
      }
    ]
  }
]

export default authRoutes
