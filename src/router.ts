import { createRouter, createWebHashHistory } from "vue-router";
import PieChartPage from "./pages/PieChartPage.vue";
import ProgressIndicatorPage from "./pages/ProgressIndicatorPage.vue";

const routes = [
  {
    path: "/pie-chart",
    component: PieChartPage,
  },
  {
    path: "/progress-indicator",
    component: ProgressIndicatorPage,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
