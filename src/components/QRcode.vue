<template>
  <img :src="qrcode" v-bind="{ ...$attrs, ...$props }" />
</template>

<script setup>
import { useStore } from 'vuex';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQRCode } from '@vueuse/integrations/useQRCode';

const store = useStore();
const router = useRouter();

const props = defineProps({
  modelValue: {
    type: String,
    default: () => {
      return '';
    },
  },
});

const src = ref(props?.value);

const qrcode = useQRCode(src || '1');

watch(
  () => props.modelValue,
  (val, prev) => {
    try {
      src.value = val.replace(/\t/g, ' ');
    } catch (e) {
      console.log(e);
      src.value = val;
    }
  },
  { deep: true, immediate: true }
);
</script>
