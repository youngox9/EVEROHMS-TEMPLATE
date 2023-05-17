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
