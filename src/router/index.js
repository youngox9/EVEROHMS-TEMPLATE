import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

const routes = [
  {
    path: "/login",
    name: "login",
    component: function () {
      return import(/* webpackChunkName: "login" */ "../views/Login.vue");
    },
  },
  {
    path: "/ETST001",
    name: "ETST001",
    component: function () {
      return import(/* webpackChunkName: "ETST001" */ "../views/ETST001");
    },
  },
  {
    path: "/ETST001_PDF",
    name: "ETST001_PDF",
    component: function () {
      return import(
        /* webpackChunkName: "ETST001_PDF" */ "../views/ETST001/ETST001_PDF.vue"
      );
    },
  },
  {
    path: "/ETST002",
    name: "ETST002",
    component: function () {
      return import(/* webpackChunkName: "ETST002" */ "../views/ETST002");
    },
  },
  {
    path: "/ETST003",
    name: "ETST003",
    component: function () {
      return import(/* webpackChunkName: "ETST003" */ "../views/ETST003");
    },
  },
  {
    path: "/ETST004",
    name: "ETST004",
    component: function () {
      return import(/* webpackChunkName: "ETST004" */ "../views/ETST004");
    },
  },
  {
    path: "/ETST005",
    name: "ETST005",
    component: function () {
      return import(/* webpackChunkName: "ETST005" */ "../views/ETST005");
    },
  },
  {
    path: "/404",
    name: "404",
    hidden: true,
    component: function () {
      return import(/* webpackChunkName: "404" */ "../views/404.vue");
    },
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404",
    hidden: true,
  },
];

const router = createRouter({
  history: createWebHashHistory("router"),

  routes,
});

export default router;
