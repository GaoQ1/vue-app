/**
 * Created by GaoQ on 2017/7/11.
 */

import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import EditProject from '@/components/EditProject'
import EditSubProject from '@/components/EditSubProject'
import Login from '@/components/Login'
import Home  from '@/components/Home'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },

    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          component: Welcome
        },
        {
          path: 'project/:id',
          component: EditProject
        },
        {
          path: 'subproject/:id',
          component: EditSubProject
        }
      ]
    },
  ]
})

export default router
