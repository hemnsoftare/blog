import home from "../../src/pages/home.vue";
import Contact from "../../src/pages/Contact.vue";
import About from "../../src/pages/About.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/contact",
    name: "Contact",
    component: Contact,
  },
];
export default routes;
