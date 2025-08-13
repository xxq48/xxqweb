import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
{
      path: '/',
      name: 'home',
      component: HomeView,
      children:[
        {
          path: '/user',
          name: 'user',
          component: () => import('../views/UserView.vue')
        },
        {
         path: '/teacher',
          name: 'teacher',
          component: () => import('../views/TeacherView.vue')
        },
        {
          path: '/role',
          name: 'role',
          component: () => import('../views/roleView.vue')
        },
         {
          path: '/news',
          name: 'news',
          component: () => import('../views/NewsView.vue')
        },
        {
          path: '/course',
          name: 'course',
          component: () => import('../views/CourseView.vue')
        },
        {
          path: '/consultation',
          name: 'consultation',
          component: () => import('../views/ConsultationView.vue')
        },
        {
          path: '/statistics',
          name: 'statistics',
          component: () => import('../views/StatisticsView.vue')
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/client',
      name: 'client',
      component: () => import('../views/ClientView.vue')
    }
  ]
})

export default router
