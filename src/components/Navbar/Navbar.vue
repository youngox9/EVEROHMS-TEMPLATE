<template>
  <div :class="`navbar ${isMenuOpen ? 'active' : ''}`">
    <el-button
      class="toggle"
      size="small"
      @click="setIsMenuOpen(!isMenuOpen)"
      v-if="showMenu"
    >
      {{ isMenuOpen ? "Close" : "Menu" }}
    </el-button>
    <div class="nav-head">
      <router-link class="logo" :to="'/site'">
        <img class="pc" src="@/assets/logo_w.png" />
        <img class="m" src="@/assets/logo1_w.png" />
      </router-link>
      <div class="nav-right">
        <el-button type="primary" circle size="small" @click="toggleDark()">
          <el-icon>
            <Moon />
          </el-icon>
        </el-button>
        <el-button link>
          <el-icon class="el-icon--left">
            <User />
          </el-icon>
          線上人數：{{ onlineUserCount }}
        </el-button>
        <Global />
        <p v-if="isLogin">區域：{{ areaText }}</p>
        <Profile v-if="isLogin" />
      </div>
      <div id="portal-target" class="nav-head-title" />
    </div>
    <div class="nav-wrap">
      <div v-if="isLogin && showSider" class="nav nav-left">
        <el-menu
          :style="{ width: '100%' }"
          :background-color="'transparent'"
          :text-color="'white'"
          :default-active="`${openArr[0]}`"
          :default-openeds="openArr"
        >
          <template v-for="item in navbarList">
            <!-- 沒有子選單 -->
            <router-link
              v-if="item.children && !item.children.length"
              v-slot="{ navigate, isActive }"
              :to="item.url"
              custom
            >
              <el-menu-item
                :index="item.id"
                :class="isActive ? 'is-active' : ''"
                @click="
                  (e) => {
                    navigate(e);
                    setIsMenuOpen(false);
                  }
                "
              >
                <span>{{ $t(`${item.resource_name}`) }}</span>
              </el-menu-item>
            </router-link>
            <!-- 有子選單 -->
            <template v-else>
              <router-link
                v-slot="{ navigate, isActive }"
                custom
                :to="item.url"
              >
                <el-sub-menu :index="item.id">
                  <template #title>
                    <span
                      @click="
                        (e) => {
                          navigate(e);
                          setIsMenuOpen(false);
                        }
                      "
                    >
                      {{ $t(`${item.resource_name}`) }}</span
                    >
                  </template>
                  <template
                    v-if="item.children"
                    v-for="subItem in item.children"
                  >
                    <router-link
                      v-slot="{ isActive, href, navigate }"
                      :to="subItem.url"
                      custom
                    >
                      <el-menu-item
                        :index="subItem.id"
                        :class="isActive ? 'is-active' : ''"
                        @click="
                          (e) => {
                            navigate(e);
                            setIsMenuOpen(false);
                          }
                        "
                      >
                        <span>{{ $t(`${subItem.resource_name}`) }}</span>
                      </el-menu-item>
                    </router-link>
                  </template>
                </el-sub-menu>
              </router-link>
            </template>
          </template>
        </el-menu>
        <!-- <div class="nav-bottom-info">
          <p>線上人數：{{ onlineUserCount }}</p>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";

import { useStore } from "vuex";
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { AREA_OPTIONS, useState } from "@/utils";
import axios from "@/axios";
import { useDark, useToggle } from "@vueuse/core";
import Profile from "./Profile.vue";
import Global from "./Global.vue";

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

onMounted(() => {
  const accessToken = store?.state?.global?.profile?.accessToken || "";
  if (accessToken) {
    getList();
  }
});

const isLogin = computed(() => {
  return !!store?.state?.global?.profile?.accessToken || false;
});

const openArr = computed(() => {
  const result = getMatched();
  if (result && result) {
    return [result];
  }
  return [];
});

function getMatched() {
  const matched = route?.matched?.[0];
  if (matched) {
    const result = navbarList.value.reduce((prev, curr, index) => {
      if (
        curr.url === matched.path ||
        (curr?.children && curr.children.find((o) => o.url === matched.path))
      ) {
        return curr.id;
      }
      return prev;
    }, 0);

    return result;
  }
  return null;
}

/**
 * 取得列表
 */
async function getList() {
  store.commit("global/setIsLoading", true);

  try {
    const res = await axios({
      url: `/api/auth/get_resource_menulist`,
      method: "post",
      showError: false,
      data: {
        resource_name: "",
        id: "",
      },
    });
    const temp = getSortedData(res?.data || []);
    // setNavbarList(temp);
    store.commit("global/setNavbarList", temp);
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}

function getSortedData(data) {
  const temp = data
    // .filter((o) => o.can_view === "Y")
    .sort((a, b) => a.sort - b.sort)
    .map((obj, idx) => {
      return {
        ...obj,
        uuid: uuidv4(),
        children: obj?.children
          ? obj.children
              // .filter((o) => o.can_view === "Y")
              .sort((a, b) => a.sort - b.sort)
              .map((o) => {
                return { ...o, uuid: uuidv4() };
              })
          : [],
      };
    });

  return temp;
}
</script>
