import AppLayout from '@/layout/AppLayout.vue'

const moduleRoutes = [
  {
    path: '/organizers',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'organizerList',
        component: () => import('@/modules/organizer/list/List.vue'),
        meta: {
          subject: 'Organizer',
          action: 'index',
          auth: true,
          title: 'Organizer'
        }
      },
      {
        path: 'new',
        name: 'newOrganizer',
        component: () => import('@/modules/organizer/entry/New.vue'),
        meta: {
          subject: 'Organizer',
          action: 'create',
          auth: true,
          title: 'New Organizer'
        }
      },
      {
        path: ':id/edit',
        name: 'editOrganizer',
        component: () => import('@/modules/organizer/entry/Edit.vue'),
        meta: {
          subject: 'Organizer',
          action: 'update',
          auth: true,
          title: 'Edit Organizer'
        }
      },
      {
        path: ':id/show',
        name: 'showOrganizer',
        component: () => import('@/modules/organizer/entry/Edit.vue'),
        meta: {
          subject: 'Organizer',
          action: 'read',
          auth: true,
          title: 'Edit Organizer'
        }
      }
    ]
  }
]

export default moduleRoutes
