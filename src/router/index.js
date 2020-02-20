import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import authGuard from "./AuthGuard";

Vue.use(VueRouter)


const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/profile',
    name: 'Profile',
    // route level code-splitting
    //  this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ '../views/Profile.vue'),
    beforeEnter: authGuard
  },
  {
    path: "/meetups",
    name: "Meetups",
    component: () => import( /* webpackChunkName: "meetup"*/ '@/views/Meetups.vue'),
    children: [{
      path: ":title",
      props: true,
      name: "MeetupItem",
      component: () => import( /* webpackChunkName: "CreateMeetup"*/ '@/components/Meetup/MeetupItem.vue')
    }]
  },
  {
    path: "/signin",
    component: () => import( /* webpackChunkName: "signin"*/ '@/views/Signin.vue')
  },
  {
    path: "/createmeetup",
    component: () => import( /* webpackChunkName: "signin"*/ '@/views/CreateMeetup.vue'),
    beforeEnter: authGuard

  },
  {
    path: "/signup",
    component: () => import( /* webpackChunkName: "signup"*/ '@/views/Signup.vue'),
  },
  {
    path: "*",
    redirect: "/"
  }
]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash,
        offset: {
          y: 65
        }
      }
    } else if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }


  },
  base: process.env.BASE_URL,
})

export default router