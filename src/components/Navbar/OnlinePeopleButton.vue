<template>
  <el-button size="small" link>
    <el-icon class="el-icon--left">
      <v-icon name="bi-people-fill" scale="1.1" />
    </el-icon>
    線上: {{ onlineUserCount }}
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
const route = useRoute();

const [isMenuOpen, setIsMenuOpen] = useState(false);

const isDark = useDark();
const toggleDark = useToggle(isDark);

const areaText = computed(() => {
  const ENT = store?.state?.global?.ENT;
  const text = AREA_OPTIONS.find((o) => o.value === ENT)?.label || "";
  return text;
});

const navbarList = computed(() => {
  return store?.state?.global?.navbarList || [];
});

const showSider = computed(() => {
  const pathname = router?.currentRoute?.value?.name;
  return pathname !== "login";
});

const showMenu = computed(() => {
  const pathname = router?.currentRoute?.value?.name !== "login";
  const accessToken = store?.state?.global?.profile?.accessToken;
  return pathname && accessToken;
});

const onlineUserCount = computed(() => {
  return store?.state?.global?.socketState?.onlineUserCount || 0;
});

const isLogin = computed(() => {
  return !!store?.state?.global?.profile?.accessToken || false;
});
</script>
