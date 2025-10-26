import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "../utils/auth";

// Pages
import HomeLayout from "../pages/HomeLayout.vue";
import Home from "../pages/Home.vue";
import SignIn from "../pages/SignIn.vue";
import SignUp from "../pages/SignUp.vue";
import Dashboard from "../pages/Dashboard.vue";
import DashboardOverview from "../pages/DashboardOverview.vue";
import Ticket from "../pages/Ticket.vue";

const routes = [
  {
    path: "/",
    component: HomeLayout,
    children: [
      {
        path: "",
        name: "Home",
        component: Home,
      },
      {
        path: "sign-in",
        name: "SignIn",
        component: SignIn,
      },
      {
        path: "sign-up",
        name: "SignUp",
        component: SignUp,
      },
    ],
  },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "DashboardOverview",
        component: DashboardOverview,
      },
      {
        path: "tickets",
        name: "Ticket",
        component: Ticket,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔒 Auth Guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ path: "/sign-in", replace: true });
  } else {
    next();
  }
});

export default router;
