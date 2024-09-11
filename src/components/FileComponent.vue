<template>
  <el-upload
    action=""
    v-model="file"
    :multiple="false"
    :http-request="() => {}"
    :show-file-list="false"
    :before-upload="onUpload"
    v-bind="{ ...$attrs, ...$props }"
  >
    <slot></slot>
  </el-upload>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, computed, watch } from "vue";
import { ElNotification, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import axios from "@/axios";
import { useState } from "@/utils";
import moment from "moment";

// import Modal from "./Modal.vue";

const props = defineProps(["onUpload"]);
const { t } = useI18n();
const store = useStore();

const ENT = computed(() => store?.state?.global?.ENT || "");

const file = ref();

const profile = computed(() => {
  return store?.state?.global?.profile || {};
});

function onUpload(file) {
  if (props?.onUpload) {
    props.onUpload(file);
  }
}
//只有預先訂單才需要顯示
</script>
<style></style>
