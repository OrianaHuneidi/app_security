import { isLogout, isLogin } from "@router/middlewares/auth";

const routes = [
  {
    path: "/",
    component: () => import("@layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "panel",
        beforeEnter: [isLogin],
        component: () => import("@pages/IndexPage.vue"),
      },
      {
        path: "contactos",
        name: "contact",
        beforeEnter: [isLogin],
        component: () => import("@pages/ContactsPage.vue"),
      },
      {
        path: "configuraciones",
        name: "config",
        beforeEnter: [isLogin],
        component: () => import("@pages/ConfiguracionPage.vue"),
      },
      {
        path: "informacion",
        name: "info",
        beforeEnter: [isLogin],
        component: () => import("@pages/InformacionPage.vue"),
      },
      {
        path: "perfil",
        name: "profile",
        beforeEnter: [isLogin],
        component: () => import("@pages/ProfileUserPage.vue"),
      },
      {
        path: "inicio-sesion",
        name: "login",
        beforeEnter: [isLogout],
        component: () => import("@pages/InicioSessionPage.vue"),
      },
      {
        path: "registro",
        name: "register",
        beforeEnter: [isLogout],
        component: () => import("@pages/RegistroDeSessionPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("@pages/ErrorNotFound.vue"),
  },
];

export default routes;
