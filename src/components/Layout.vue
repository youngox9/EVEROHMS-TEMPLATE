<template>
  <div class="container">
    <Navbar />
    <div class="content"><slot v-if="isReady" /></div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { onMounted, computed, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { useState } from "@/utils";
import axios from "@/axios";
import Navbar from "@/components/Navbar";

const props = defineProps(["auth", "showSider"]);
const { t } = useI18n();
const store = useStore();
const router = useRouter();

const [isReady, setIsReady] = useState(false);

const isAdmin = computed(() => {
  const role_id = store?.state?.global?.profile?.role_id;
  return role_id === 1;
});

onBeforeMount(() => {
  onInit();
});

/**
 * 顯示內容前，先檢查看看是否有token
 */
async function onInit() {
  setIsReady(false);
  try {
    const accessToken = store?.state?.global?.profile?.accessToken || "";
    if (accessToken) {
      // 如果有token，在取得權限表，檢查看看是否可以顯示，不行的話就踢出去
      await getUserData();
      await checkMenuListCanView();
      // checkRedirect();
    } else {
      if (props.auth) {
        logout();
      }
    }
  } catch (e) {
    console.log("e >>>", e);
    logout();
  }
  setIsReady(true);
}

/**
 * 取得列表檢查使用者是否可以進入，否則就踢到login
 */
async function checkMenuListCanView() {
  // 如果是管理者就不用檢查了

  store.commit("global/setIsLoading", true);

  try {
    const res = await axios({
      url: `/api/auth/get_resource_menulist`,
      method: "post",
      showError: false,
      data: {
        resource_name: "",
        id: "",
        sys_name: "SFC",
      },
    });
    const temp = res?.data || [];
    const currentPath = router.currentRoute.value.path.toLowerCase();
    const paths = [...getPathList(temp), "/404", "/login", "/", "/site"];

    store.commit("global/setNavbarList", temp);

    /** admin 就不用踢了 */
    if (isAdmin?.value === false) {
      if (paths.includes(currentPath)) {
        console.log("IS MATCH");
        // console.log(paths);
      } else {
        logout();
      }
    }
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}

/**
 * 攤平menulist只留path
 * @param {} list
 */
function getPathList(list = []) {
  return list.reduce((prev, curr) => {
    const url = curr?.url ? curr.url.toLowerCase() : "";
    if (curr.children) {
      if (url) {
        return [...prev, url, ...getPathList(curr.children)];
      }
      return [...prev, ...getPathList(curr.children)];
    }
    if (url) {
      return [...prev, url];
    }
    return [...prev];
  }, []);
}
/**
 * 檢查權限表
 */
async function getUserData() {
  try {
    // throw new Error();
    // return;
    const res = await axios({
      url: "/common/sfc/authorization",
      method: "post",
      showError: false,
    });
    const profile = res?.data || {};
    store.commit("global/setProfile", profile);
    return res;
  } catch (e) {
    console.log(">>>>>", e);
    throw new Error();
  }
}

/**
 * 登出踢回登入頁面
 */
function logout() {
  router.push({ name: "login" });
  store.commit("global/logout");
}
</script>
