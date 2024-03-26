const menuList = [
  {
    items: [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        to: '/',
        action: 'index',
        subject: 'Dashboard'
      },
      {
        label: 'Users',
        icon: 'pi pi-fw pi-user',
        to: '/users',
        action: 'index',
        subject: 'User'
      },
      {
        label: 'Organizers',
        icon: 'pi pi-fw pi-sitemap',
        to: '/organizers',
        action: 'index',
        subject: 'Organizer'
      },
      {
        label: 'Events',
        icon: 'pi pi-fw pi-calendar-plus',
        to: '/events',
        action: 'index',
        subject: 'Event'
      }
    ]

  }
]

export default menuList
