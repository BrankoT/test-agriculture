import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/tractor/:tractorId',
    name: 'Tractor',
    component: () => import(/* webpackChunkName: "tractor" */ '../views/Tractor.vue')
  },
  {
    path: '/tractor/:tractorId/point/:pointId',
    name: 'TractorEdit',
    component: () => import(/* webpackChunkName: "tractor-edit" */ '../views/TractorEdit.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
