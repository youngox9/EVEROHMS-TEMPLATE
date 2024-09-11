import * as vueI18n from "vue-i18n";
import data from "./lib.js";

const i18n = vueI18n.createI18n({
  locale: "zh_tw",
  legacy: false,
  // fallbackLocale: "tw",
  fallbackWarn: false,
  missingWarn: false,
  globalInjection: true,
  messages: {
    ...data,
    debug: {},
  },
});

// console.log(i18n, vueI18n);
export default i18n;
