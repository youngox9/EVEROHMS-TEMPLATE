<!-- 登入頁面 -->
<template>
  <Layout :auth="true">
    <div class="page-not-found">Page Not Found</div>
  </Layout>
</template>
<script setup>
import { useStore } from "vuex";
import { ref, unref, computed, reactive, watch, toRefs, onMounted } from "vue";
import { ElNotification, ClickOutside as vClickOutside } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "@/axios";

const props = defineProps([]);
const { t } = useI18n();
const store = useStore();
const router = useRouter();
</script>
