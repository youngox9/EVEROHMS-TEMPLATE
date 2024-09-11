<template>
  <img :src="src" v-bind="{ ...$attrs, ...$props }" v-if="src" />
</template>

<script setup>
import JsBarcode from "jsbarcode";
import { watch } from "vue";
import { useState } from "@/utils";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const [src, setSrc] = useState("");

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
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, val);
  const base64 = canvas.toDataURL("image/png");
  setSrc(base64);
}
</script>
