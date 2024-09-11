<template>
  <div class="pivot-container">
    <div :id="tableId" />
  </div>
</template>

<script setup>
import { defineExpose, onMounted, watch, ref, onUpdated } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useState } from '@/utils';

import { v4 as uuidv4 } from 'uuid';
import $ from 'jquery';

// window.$ = $;
import 'jquery-ui/dist/jquery-ui.js';
import 'pivottable';

// import "jquery-ui/ui/core";
// import "jquery-ui/ui/widgets/datepicker";

let timer = null;

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: [
      { color: 'blue', shape: 'circle' },
      { color: 'red', shape: 'triangle' },
    ],
  },
  config: {
    type: Object,
    required: true,
    default: {
      rows: [],
      cols: [],
    },
  },
});

const { t } = useI18n();
const tableId = ref(uuidv4());

defineExpose({
  //   pageConfig,
  //   setPageConfig: (config) => {
  //     setPageConfig({ ...pageConfig.value, ...config });
  //   },
});

onMounted(() => {
  initPivot();
});

watch(
  () => [props?.data, props?.config],
  (value, prev) => {
    initPivot();
  },
  { deep: true, immediate: true }
);

function findElement(id) {
  const $target = $(`#${id}`);
  return new Promise((resolve) => {
    timer = setInterval(() => {
      if ($target.length) {
        clearInterval(timer);
        resolve($target);
      }
    }, 300);
  });
}

async function initPivot() {
  const $target = await findElement(tableId.value);
  if ($target.length) {
    $target.empty();
    $target.pivotUI(props.data, props.config, true);
  }
}
</script>
