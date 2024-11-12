<template>
  <div class="barcode" v-if="src" v-bind="{ ...$attrs, ...$props }">
    <img :src="src" />
    <p>{{ modelValue }}</p>
  </div>
</template>

<script setup>
import JsBarcode from 'jsbarcode';
import { watch } from 'vue';
import { useState } from '@/utils';

const props = defineProps({
  height: {
    type: String,
    default: 20,
  },
  modelValue: {
    type: String,
    default: '',
  },
});

const [src, setSrc] = useState('');

watch(
  () => props.modelValue,
  (val, prev) => {
    if (val && val?.length) {
      getBarcodeSrc(val);
    }
  },
  { deep: false, immediate: true }
);

function getBarcodeSrc(val) {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, val, {
    // width: 200,
    height: props.height || 20,
    margin: 0,
    displayValue: false,
  });
  const base64 = canvas.toDataURL('image/png');
  setSrc(base64);
}
</script>

<style lang="scss" scoped>
.barcode {
  width: 100%;
  max-width: 200px;
  /* height: 100px; */
  /* margin-bottom: 12px; */
  display: block;
  &.w-100 {
    width: 100px;
  }
  > img {
    width: 100%;
    height: 20px;
  }
  p {
    line-height: 1;
    font-size: 15px;
  }
}
</style>
