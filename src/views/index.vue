<template>
  <Layout :auth="true"></Layout>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const props = defineProps([]);

const { t } = useI18n();
const store = useStore();

onMounted(() => {});
</script>
