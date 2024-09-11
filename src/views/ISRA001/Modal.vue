<template>
  <el-dialog
    width="600px"
    v-model="modalConfig.isOpen"
    :title="`${modalConfig.mode === 'add' ? $t('add') : $t('edit')} ${$t(
      'title_ISRA001'
    )}`"
  >
    <el-form :model="form" ref="formRef" :label-position="'top'" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12" v-for="fieldKey in Object.keys(fieldsSetting)">
          <DynamicField
            v-model="form[fieldKey]"
            :config="{ ...fieldsSetting[fieldKey], fieldKey }"
          />
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">{{ t("cancel") }}</el-button>
        <el-button
          v-if="modalConfig.mode === 'add'"
          type="primary"
          @click="onAdd"
          >{{ t("submit") }}</el-button
        >
        <el-button
          v-if="modalConfig.mode === 'edit'"
          type="primary"
          @click="onEdit"
          >{{ t("submit") }}</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useStore } from "vuex";
import { onMounted, ref, computed, reactive, watch, useAttrs } from "vue";
import moment from "moment";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useVModel } from "@vueuse/core";
import axios from "@/axios";
import { useState, ElNotification, VALIDATIONS } from "@/utils";

const attrs = useAttrs();
const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);
const modalConfig = useVModel(props, "modelValue", emit);

const { locale, t } = useI18n();
const store = useStore();

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

const formRef = ref();

let [form, setForm] = useState({
  ISRA001: "",
  ISRA002: "T100 系統設置: ..",
  ISRA003: "123456789",
  ISRA004: moment(new Date()).format("YYYY-MM-DD"),
  ISRA005: "",
  ISRA006: "TEST",
  ISRA007: "異動",
  ISRA008: "系統設定",
  ISRA009: "",
  ISRA010: "",
  ISRA016: "",
});

const profile = computed(() => {
  return store?.state?.global?.profile || {};
});

const fieldsSetting = reactive({
  ISRA001: {},
  ISRA002: { type: "textarea" },
  ISRA003: {},
  ISRA004: {
    type: "date",
  },
  ISRA005: {
    type: "date",
  },
  ISRA006: {},
  ISRA007: {},
  ISRA008: {},
  ISRA009: {
    type: "textarea",
  },
  ISRA010: {
    type: "date",
  },
  ISRA016: {
    type: "select",
    options: [
      { label: "處理中", value: 0 },
      { label: "驗收中", value: 1 },
    ],
  },
});

const rules = reactive({
  //ISRA001: [VALIDATIONS.isEmpty()],
  ISRA002: [VALIDATIONS.isEmpty()],
  ISRA003: [VALIDATIONS.isEmpty()],
  ISRA006: [VALIDATIONS.isEmpty()],
  ISRA007: [VALIDATIONS.isEmpty()],
  ISRA008: [VALIDATIONS.isEmpty()],
});

onMounted(() => {});

watch(
  () => modalConfig?.value?.data || {},
  (val) => {
    const newData = modalConfig?.value?.data;
    setForm({ ...newData });
  },
  { deep: true }
);

async function onAdd() {
  store.commit("global/setIsLoading", true);
  try {
    await axios({
      url: `/isr/isra001_ins01`,
      method: "post",
      data: {
        ENT: ENT.value,
        USERID: profile.value.username,
        ...form.value,
      },
    });
    ElNotification({
      title: "Success",
      message: `${t("add")}${t("success")}`,
      type: "success",
    });

    modalConfig.value.isOpen = false;
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}
async function onEdit() {
  store.commit("global/setIsLoading", true);
  try {
    await axios({
      url: `/isr/isra001_upd01`,
      method: "post",
      data: {
        ENT: ENT.value,
        USERID: profile.value.username,
        ...form.value,
      },
    });
    ElNotification({
      title: "Success",
      message: `${t("save")}${t("success")}`,
      type: "success",
    });
    modalConfig.value.isOpen = false;
    // emit("update:modelValue", { ...attrs.modelValue, isOpen: false });
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}

/** 取消按钮 */
function onCancel() {
  modalConfig.value.isOpen = false;
}
</script>
