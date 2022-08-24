
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('src/pages/login/IndexPage.vue'),
    // children: [
    //   { path: '', component: () => import('pages/IndexPage.vue') }
    // ]
  },
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/application/index.vue'),
  }

  // Always leave this as last one,
  // but you can also remove it
  // {
  //   path: '/:catchAll(.*)*',
  //   component: () => import('pages/ErrorNotFound.vue')
  // }
]

export default routes
