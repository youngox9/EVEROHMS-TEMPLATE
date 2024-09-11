<template>
  <Layout :auth="true"></Layout>
</template>
<script setup>
import { onMounted } from "vue";
import { useStore } from "vuex";

import { useI18n } from "vue-i18n";

const props = defineProps([]);
const { t } = useI18n();
const store = useStore();

onMounted(() => {});
</script>
