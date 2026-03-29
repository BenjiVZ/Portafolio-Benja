import { createRouter, createWebHistory } from 'vue-router'
import PortfolioView from '../views/PortfolioView.vue'

const routes = [
  {
    path: '/',
    name: 'portfolio',
    component: PortfolioView
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

export default router
