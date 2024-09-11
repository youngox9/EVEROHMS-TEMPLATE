<template>
  <el-tooltip content="語系" placement="bottom">
    <el-button link circle ref="buttonRef" v-click-outside="onClickOutside">
      <el-icon>
        <v-icon name="fa-globe-asia" scale="1.1" />
      </el-icon>
      <!-- {{ $t(lang) }} -->
    </el-button>
  </el-tooltip>
  <el-popover
    ref="popoverRef"
    :virtual-ref="buttonRef"
    trigger="click"
    virtual-triggering
    placement="bottom-end"
    width="140px"
  >
    <div class="menu">
      <a
        v-for="langText in langList"
        :class="lang === langText ? 'active' : ''"
        @click="setLang(langText)"
        >{{ $t(langText) }}</a
      >
    </div>
  </el-popover>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, unref, computed, onMounted } from "vue";
import { ClickOutside as vClickOutside } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import i18nJSON from "@/i18n/lib.js";

const store = useStore();
const router = useRouter();

onMounted(() => {
  // const langs = Object.keys(i18nJSON) || [];
  // store.commit("global/setLangList", langs);
});

const profile = computed(() => {
  return store?.state?.global?.profile || {};
});

const lang = computed(() => {
  return store?.state?.global?.lang || [];
});
const langList = computed(() => {
  return store?.state?.global?.langList || [];
});

const { locale } = useI18n();

const buttonRef = ref();
const popoverRef = ref();

function setLang(lang) {
  store.commit("global/setLang", lang);
  locale.value = lang;
}

const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.();
};
</script>
