import Vue from 'vue';
import VueRouter from 'vue-router';

/* Layout */
import Layout from '../views/layout/Layout.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login/Login.vue'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/404'),
    hidden: true,
  },
  {
    path: '/course',
    component: Layout,
    redirect: '/rili',
    name: 'CourseRili',
    children: [
      {
        path: 'rili',
        component: () => import(/* webpackChunkName: "course" */ '@/views/course/Course'),
      },
    ],
  },
  {
    path: '/manage',
    component: Layout,
    redirect: '/manage/module',
    name: 'Manage',
    children: [
      {
        path: 'module',
        name: 'Module',
        component: () => import(/* webpackChunkName: "modules" */ '@/views/manage/Manage'),
      },
      {
        path: 'detail/:code',
        name: 'Detail',
        component: () => import(/* webpackChunkName: "module-one" */ '@/views/manage/Detail'),
      },
    ],
  },
  {
    path: '/verify',
    component: Layout,
    name: 'Verify',
    children: [
      {
        path: 'edit',
        name: 'VerifyEdit',
        component: () => import(/* webpackChunkName: "verify-edit" */ '@/views/verify/VerifyEdit'),
      },
      {
        path: 'detail',
        name: 'VerifyDetail',
        component: () => import(/* webpackChunkName: "verify-detail" */ '@/views/verify/VerifyDetail'),
      },
    ],
  },
  { path: '*', redirect: '/404', hidden: true },
];

const router = new VueRouter({
  // mode: 'history',
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes,
});

export default router;
