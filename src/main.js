import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import ElementPlus from "element-plus";
import * as ElementIcons from "@element-plus/icons-vue";

import Layout from "@/components/Layout.vue";

import "@/styles/styles.scss";
import i18n from "@/i18n";
import { logEnv } from "@/utils";
import "@/socket";

import TableWithPagination from "@/components/TableWithPagination.vue";

const app = createApp(App);
app.use(i18n);
app.use(router);

app.use(ElementPlus);
app.use(store);

Object.entries({ ...ElementIcons }).forEach(([name, component]) =>
  app.component(name, component)
);
app.component("TableWithPagination", TableWithPagination);
app.component("Layout", Layout);
app.mount("#app");

// log 當前環境
logEnv();
