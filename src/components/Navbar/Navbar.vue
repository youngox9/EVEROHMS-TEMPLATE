<template>
  <div :class="`navbar ${isMenuOpen ? 'active' : ''}`">
    <div class="nav-head">
      <router-link class="logo" :to="'/ETST001'">
        <img class="pc" src="@/assets/logo_w.png" />
        <img class="m" src="@/assets/logo1_w.png" />
      </router-link>
      <div class="nav-right">
        <ThemeButton />
        <GlobalButton />
        <ProfileButton v-if="isLogin" />
        <MenuToggleButton />
      </div>
      <div id="portal-target" class="nav-head-title" />
    </div>
    <div class="nav-wrap">
      <div v-if="isLogin && showSider" class="nav nav-left" ref="navLeft">
        <vue-resizable
          :active="handlers"
          :minWidth="200"
          :width="memoNavbarWidth"
          @resize:move="eHandler"
          @resize:end="eHandler"
        >
          <div class="nav-left-scroll">
            <el-input
              size="small"
              v-model="searchKeyword"
              type="string"
              placeholder="搜尋關鍵字"
              :suffix-icon="Search"
              class="menu-search"
              clearable
            />
            <div
              class="menu"
              v-if="navbarList.length"
              :style="{ width: '100%' }"
            >
              <MenuItem v-for="item in navbarList" :item="item" />
            </div>
          </div>
        </vue-resizable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { Search } from "@element-plus/icons-vue";
import VueResizable from "vue-resizable";
import { useLocalStorage } from "@vueuse/core";

import {
  GlobalButton,
  ThemeButton,
  MenuItem,
  ProfileButton,
  MenuToggleButton,
} from "@/components/Navbar";

const props = defineProps(["auth"]);
const { t } = useI18n();
const store = useStore();
const router = useRouter();
const searchKeyword = ref("");
const handlers = ref(["r"]);

const memoNavbarWidth = useLocalStorage("memoNavbarWidth", 200);

function eHandler(data) {
  memoNavbarWidth.value = data.width;
}

const navbarList = computed(() => {
  const navbarList = store?.state?.global?.navbarList;
  if (navbarList?.length && searchKeyword.value) {
    const newSearchList = getSearchList(navbarList, searchKeyword.value);
    return newSearchList || [];
  } else {
    return navbarList || [];
  }
});

function compareText(a, b) {
  const aa = a.toLocaleUpperCase();
  const bb = b.toLocaleUpperCase();
  return aa.includes(bb) || bb.includes(aa);
}

function getSearchList(list, keyword = "") {
  return list.reduce((prev, curr) => {
    let temp = [];
    if (compareText(curr.resource_name, keyword) && !curr?.children?.length) {
      temp = [...temp, curr];
    }
    if (curr?.children?.length) {
      const chList = getSearchList(curr.children, keyword);
      temp = [...temp, ...chList];
    }
    return [...prev, ...temp];
  }, []);
}

const showSider = computed(() => {
  const pathname = router?.currentRoute?.value?.name;
  return pathname !== "login";
});

const isMenuOpen = computed(() => {
  return store?.state?.global?.isMenuOpen || false;
});

const isLogin = computed(() => {
  return !!store?.state?.global?.profile?.accessToken || false;
});

const textColor = ref("red");
</script>

<style lang="scss">
body {
  color: var(--text-color);
}
</style>
