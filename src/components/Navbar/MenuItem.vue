<template>
  <!--  沒有次選單 -->
  <div
    ref="menuItem"
    :class="`menu-item ${isActive && 'active'}`"
    v-if="!item?.children || !item?.children?.length"
    :index="item.id"
    @click="onClickLink(item.url)"
  >
    <span :id="item.id">{{ $t(`${item.resource_name}`) }}</span>
  </div>
  <!--  有次選單 -->
  <template v-else>
    <template v-if="width > 768">
      <el-popover
        :width="220"
        trigger="hover"
        popper-class="menu-popover"
        placement="right-start"
      >
        <template #reference>
          <div :class="`menu-item menu-item-has-child ${isShow && 'active'}`">
            <span :id="item.id" @click="onClickLink(item.url)">
              {{ $t(`${item.resource_name}`) }}</span
            >
            <div class="arrow" @click="setIsShow(!isShow)">
              <v-icon name="md-keyboardarrowright-round" />
            </div>
          </div>
        </template>
        <div class="sub-menu">
          <MenuItem
            :item="subItem"
            :openedIds="openedIds"
            v-if="item?.children"
            v-for="subItem in item.children"
          />
        </div>
      </el-popover>
    </template>
    <template v-else>
      <div :class="`menu-item menu-item-has-child ${isShow && 'active'}`">
        <span :id="item.id" @click="onClickLink(item.url)">
          {{ $t(`${item.resource_name}`) }}</span
        >
        <div class="arrow" @click="setIsShow(!isShow)">
          <v-icon name="md-keyboardarrowright-round" />
        </div>
      </div>
      <div class="sub-menu">
        <MenuItem
          :item="subItem"
          :openedIds="openedIds"
          v-if="item?.children"
          v-for="subItem in item.children"
        />
      </div>
    </template>
  </template>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, computed, onMounted, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { useState } from "@/utils";
import { useWindowSize } from "@vueuse/core";
import MenuItem from "./MenuItem.vue";

const props = defineProps(["item", "openedIds"]);
const { t } = useI18n();
const store = useStore();
const router = useRouter();
const route = useRoute();
const [isShow, setIsShow] = useState(false);
const menuItem = ref(null);

const { width, height } = useWindowSize();

const isActive = computed(() => {
  return route.matched.some((obj) => obj.path === props.item.url);
});

const groupActive = computed(() => {
  let result = false;
  const children = props?.item?.children || [];
  if (children && children?.length) {
    result = children.some((item) => {
      return route.matched.some((obj) => obj.path === item.url);
    });
  }
  return result;
});

onBeforeMount(() => {
  if (groupActive.value || isActive.value) {
    setIsShow(true);
  }
});

onMounted(() => {
  if (isActive.value && menuItem?.value) {
    menuItem?.value?.scrollIntoView({ block: "center", inline: "nearest" });
  }
});

function onClickLink(url) {
  setIsShow(true);
  closeMenu();
  if (url) {
    router.push(url);
  }
}

function closeMenu() {
  // const isMenuOpen = store?.state?.global?.isMenuOpen || false;
  store.commit("global/setIsMenuOpen", false);
}
</script>
