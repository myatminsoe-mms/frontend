import AppLayout from '@/layout/AppLayout.vue'

const moduleRoutes = [
  {
    path: '/events',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'eventList',
        component: () => import('@/modules/event-ticket/list/List.vue'),
        meta: {
          subject: 'Event',
          action: 'index',
          auth: true,
          title: 'Event'
        }
      },
      {
        path: 'new',
        name: 'newEvent',
        component: () => import('@/modules/event-ticket/entry/New.vue'),
        meta: {
          subject: 'Event',
          action: 'create',
          auth: true,
          title: 'New Event'
        }
      },
      {
        path: ':id/edit',
        name: 'editEvent',
        component: () => import('@/modules/event-ticket/entry/Edit.vue'),
        meta: {
          subject: 'Event',
          action: 'update',
          auth: true,
          title: 'Edit Event'
        }
      },
      {
        path: ':id/show',
        name: 'showEvent',
        component: () => import('@/modules/event-ticket/entry/Edit.vue'),
        meta: {
          subject: 'Event',
          action: 'read',
          auth: true,
          title: 'Edit Event'
        }
      }
    ]
  }
]

export default moduleRoutes
