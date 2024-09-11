<template>
  <Autocomplete
    v-model="modelValue"
    :onFetch="getList"
    width="380px"
    :onClose="onClose"
    :v-bind="$attrs"
  >
    <slot />
  </Autocomplete>
</template>

<script setup>
import { computed, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useVModel } from "@vueuse/core";

import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "@/axios";

const DEFAULT_CONFIG = {
  employee: {
    labelKey: "OOAG011",
    valueKey: "ETSB001",
    apiUrl: "/ets/ets_etsb001_get01",
  },
};

const props = defineProps([
  "modelValue",
  "labelKey",
  "valueKey",
  "apiUrl",
  "type",
  "onClose",
]);
const { t } = useI18n();
const store = useStore();
const router = useRouter();

onMounted(() => {});

const emit = defineEmits();
const modelValue = useVModel(props, "modelValue", emit);
const global = computed(() => store?.state?.global || "");
/*
 * 取得部門列表
 */
async function getList() {
  const ENT = global?.value?.ENT || "";
  const defaultConfig = DEFAULT_CONFIG?.[props?.type] || props;
  const { labelKey = "", valueKey = "", apiUrl = "" } = defaultConfig || {};
  try {
    const res = await axios({
      url: apiUrl,
      method: "post",
      showError: false,
      showLoading: false,
      data: {
        ENT,
        SITE: "0001",
      },
    });

    // console.log("res >>>", res);

    const data = res?.data || [];

    const list = data.map((obj) => {
      const label = obj?.[labelKey] || "";
      const value = obj?.[valueKey] || "";
      return { value, label: `${label}/${value}` };
    });
    return list;
  } catch (e) {
    console.log(">>>>>>>>>>", e);
  }
  return [];
}
</script>
