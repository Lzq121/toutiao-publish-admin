import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Layout from '@/views/Layout'
import Article from '@/views/Article'
import Publish from '@/views/Publish'
import Image from '@/views/image'
import Comment from '@/views/Comment'
import Setting from '@/views/Setting'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/image',
        name: 'image',
        component: Image
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      },
      {
        path: '/setting',
        name: 'setting',
        component: Setting
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(window.localStorage.getItem('user'));
  if(to.path !== '/login'){
    if(user){
      next();
    }else{
      next('/login')
    }
  }else{
    next();
  }
})

export default router
