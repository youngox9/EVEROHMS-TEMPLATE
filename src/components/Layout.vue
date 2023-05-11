<template>
  <Navbar />
  <div class="container">
    <div class="content"><slot v-if="isReady" /></div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { onMounted, onBeforeMount } from "vue";
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

onMounted(() => {
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
