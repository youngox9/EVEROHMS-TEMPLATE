<template>
  <el-tooltip content="夜間模式" placement="bottom">
    <el-button link @click="toggleDark()">
      <el-icon>
        <v-icon name="ri-moon-clear-line" v-if="isDark" />
        <v-icon name="md-wbsunny-outlined" v-else />
      </el-icon>
    </el-button>
  </el-tooltip>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";

import { useStore } from "vuex";
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import axios from "@/axios";
import { useDark, useToggle, useResizeObserver } from "@vueuse/core";

const props = defineProps(["auth"]);
const { t } = useI18n();
const store = useStore();
const router = useRouter();
const route = useRoute();

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>
