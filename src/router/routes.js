const routes = [
  {
    path: '/',
    component: () => import('@layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@pages/IndexPage.vue') },
      { path: 'contactos', component: () => import('@pages/ContactsPage.vue') },
      { path: 'configuraciones', component: () => import('@pages/ConfiguracionPage.vue') },
      { path: 'informacion', component: () => import('@pages/InformacionPage.vue') },
      { path: 'inicio-sesion', component: () => import('@pages/InicioSessionPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@pages/ErrorNotFound.vue')
  }
]

export default routes
