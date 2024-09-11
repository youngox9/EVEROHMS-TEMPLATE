<template>
  <div class="pdf-header">
    <img class="logo" src="@/assets/logo.png" />
    <h2>{{ title }}</h2>
    <Barcode class="barcode" :model-value="barcode" />
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useState } from "@/utils";
import Barcode from "@/components/Barcode.vue";

const props = defineProps(["barcode", "title"]);
const { t } = useI18n();
const store = useStore();
const router = useRouter();
const route = useRoute();

const profile = computed(() => {
  return store?.state?.global?.profile || {};
});

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});
</script>

<style lang="scss">
@page {
  size: A4;
  /* 上边 | 左边右边 | 下边 */
  margin: 0.5em auto 1.5em;
  //margin: 0.25em 1.5em;
}

html,
body {
  height: 100%;
  overflow: hidden;
  background: #fff;
  font-size: 12px;
}
</style>

<style lang="scss" scoped>
.pdf-header {
  .barcode {
    position: absolute;
    top: 0;
    right: 0;
    width: 160px;
    @media print {
      position: fixed;
    }
  }
  .logo {
    position: relative;
    display: block;
    margin: 0 auto;
    left: 0;
    top: 0;
    width: 350px;
    margin: 20px auto 0% auto;
  }
  h2 {
    font-size: 2em;
    text-align: center;
    display: block;
    margin: 0px 0 12px 0;
    line-height: 1.5;
    font-weight: bolder;
    margin-bottom: 24px;
    border-bottom: 1px solid black;
  }
}
</style>
