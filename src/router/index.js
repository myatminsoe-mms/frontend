import { createRouter, createWebHistory } from 'vue-router'
import dashboardRoutes from '@/modules/dashboard/route'
import userRoutes from '@/modules/user/route'
import organizerRoutes from '@/modules/organizer/route'
import authRoutes from '@/modules/auth/authRoute'
import eventRoutes from '@/modules/event-ticket/route'
import { useAuthStore } from '@/modules/auth/authStore'
import { canNavigate } from '@/libs/acl/routeProtection'
import EventBus from '@/libs/AppEventBus'

const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...userRoutes,
  ...organizerRoutes,
  ...eventRoutes,
  {
    path: '/notfound',
    name: 'notfound',
    component: () => import('@/pages/NotFound.vue')
  },
  {
    path: '/not-authorized',
    name: 'not-authorized',
    component: () => import('@/pages/Access.vue')
  },
  {
    path: '/error',
    name: 'error',
    component: () => import('@/pages/Error.vue')
  },
  {
    path: '/:catchAll(.*)*',
    redirect: 'notfound'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'router-link-active',
  linkExactActiveClass: 'router-link-exact-active',
  // Use the HTML5 history API (i.e. normal-looking routes)
  // instead of routes with hashes (e.g. example.com/#/about).
  // This may require some server configuration in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  mode: 'history',
  // Simulate native-like scroll behavior when navigating to a new
  // route and using back/forward buttons.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, left: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  // Set progress to true when navigating to a new route
  EventBus.emit('progress', true)

  window.scrollTo(0, 0)
  const authStore = useAuthStore()
  const isLoggedIn = authStore.isAuth

  if (to.meta.auth && !isLoggedIn) {
    return next({ name: 'login' })
  }

  if (!canNavigate(to)) {
    // Redirect to login if not logged in
    if (!isLoggedIn) return next({ name: 'login' })

    // If logged in => not authorized
    return next({ name: 'not-authorized' })
  }
  // Redirect if logged in
  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    return next({ name: 'dashboard' })
  }
  return next()
})

router.afterEach(() => {
  // Set progress to false when the route has finished loading
  EventBus.emit('progress', false)
})

export default router
