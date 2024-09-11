<template>
  <el-button size="small" link>
    <el-icon class="el-icon--left">
      <v-icon name="bi-pin-map-fill" />
    </el-icon>
    地區: {{ areaText }}
  </el-button>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { AREA_OPTIONS, useState } from "@/utils";
import { useDark, useToggle } from "@vueuse/core";

const props = defineProps(["auth"]);
const { t } = useI18n();
const store = useStore();
const router = useRouter();

const areaText = computed(() => {
  const ENT = store?.state?.global?.ENT;
  const text = AREA_OPTIONS.find((o) => o.value === ENT)?.label || "";
  return text;
});
</script>
