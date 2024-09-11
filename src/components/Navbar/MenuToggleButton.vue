<template>
  <el-button class="toggle" size="small" @click="toggleMenu">
    <el-icon>
      <v-icon name="md-close-round" scale="1.5" v-if="isMenuOpen" />
      <v-icon name="fa-bars" scale="1.5" v-else />
    </el-icon>
  </el-button>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";

import { useStore } from "vuex";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { AREA_OPTIONS, useState } from "@/utils";
import axios from "@/axios";

import {
  GlobalButton,
  ErrorListButton,
  ThemeButton,
  MenuItem,
  AreaButton,
  OnlinePeopleButton,
  ProfileButton,
} from "@/components/Navbar";

const props = defineProps(["auth"]);
const { t } = useI18n();
const store = useStore();
const router = useRouter();

const isMenuOpen = computed(() => {
  return store?.state?.global?.isMenuOpen || false;
});

function toggleMenu() {
  const isMenuOpen = store?.state?.global?.isMenuOpen || false;
  store.commit("global/setIsMenuOpen", !isMenuOpen);
}
</script>
