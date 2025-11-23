import { createApp } from "vue";
import "./style.css";
import { createWebHistory, createRouter } from "vue-router"; // Use createWebHistory
import App from "./App.vue";
import { clerkPlugin } from "@clerk/vue";

// Define routes
const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },
  {
    path: "/contact",
    name: "contact",
    component: Contact,
  },
  {
    path: "/price",
    name: "price",
    component: Priceing,
  },
  {
    path: "/create-blog",
    name: "create-blog",
    component: () => import("./pages/post/CreateBlog.vue"),
  },
  {
    path: "/blog/:id",
    name: "post-details",
    component: () => import("./pages/post/PostDetails.vue"),
  },
];

// Create router instance
const router = createRouter({
  history: createWebHistory(), // Use createWebHistory for normal client-side routing
  routes,
});

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

import { VueQueryPlugin } from "@tanstack/vue-query";
import Home from "./feature-modules/information/Home.vue";
import About from "./feature-modules/information/About.vue";
import Contact from "./feature-modules/information/Contact.vue";
import Priceing from "./pages/Priceing.vue";

// Mount the app
createApp(App)
  .use(router)
  .use(clerkPlugin, { publishableKey: PUBLISHABLE_KEY })
  .use(VueQueryPlugin)
  .mount("#app");
