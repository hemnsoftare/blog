import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createWebHistory, createRouter } from "vue-router"; // Use createWebHistory
import Home from "../feature-modules/information/Home.vue";
import About from "../feature-modules/information/About.vue";
import Contact from "../feature-modules/information/Contact.vue";

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
];

// Create router instance
const router = createRouter({
  history: createWebHistory(), // Use createWebHistory for normal client-side routing
  routes,
});

// Mount the app
createApp(App).use(router).mount("#app");
