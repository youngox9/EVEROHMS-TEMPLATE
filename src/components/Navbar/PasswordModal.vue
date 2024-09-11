<template>
  <el-dialog
    :draggable="true"
    width="400px"
    :title="'修改密碼'"
    :append-to-body="true"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    :destroy-on-close="true"
    :before-close="() => $emit('update:modelValue', false)"
    v-bind="$attrs"
  >
    <el-form ref="formEl" :model="form" :rules="rules" :label-position="'top'">
      <el-form-item :label="$t('password')" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          show-password
          :placeholder="$t('password')"
        />
      </el-form-item>

      <el-form-item :label="$t('comfirm_password')" prop="comfirm_password">
        <el-input
          v-model="form.comfirm_password"
          type="password"
          show-password
          :placeholder="$t('comfirm_password')"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="() => $emit('update:modelValue', false)">{{
          $t("cancel")
        }}</el-button>
        <el-button type="primary" @click="submitform"
          >{{ $t("submit") }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { useStore } from "vuex";
import {
  markRaw,
  ref,
  unref,
  computed,
  reactive,
  watch,
  toRefs,
  onMounted,
  useAttrs,
} from "vue";
import { ElMessageBox } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "@/axios";
import { VALIDATIONS, useState } from "@/utils";

const attrs = useAttrs();
const router = useRouter();

const props = defineProps([]);
// const emit = defineEmits(["update:isOpen", "isOpen"]);
const { t } = useI18n();
const store = useStore();

const [form, setForm] = useState({
  password: "",
  comfirm_password: "",
});

const rules = reactive({
  password: [VALIDATIONS.isEmpty()],
  comfirm_password: [
    VALIDATIONS.isEmpty(),
    VALIDATIONS.custom((rule, value, callback) => {
      if (value !== form?.value?.password) {
        callback(new Error("密碼不相符"));
      } else {
        callback();
      }
    }),
  ],
});

const formEl = ref(null);

const emit = defineEmits(["update:modelValue"]);

// onMounted(() => {

// });

watch(
  () => [attrs.modelValue],
  (val) => {
    const [isOpen] = val;
    if (isOpen) {
    } else {
      const formObj = formEl?.value;
      if (formObj) {
        formObj.resetFields();
      }
    }
  },
  { deep: true }
);

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

const profile = computed(() => {
  return store?.state?.global?.profile || {};
});

async function submitform() {
  const formObj = formEl?.value;
  if (formObj) {
    await formObj.validate((valid, fields) => {
      if (valid) {
        console.log("profile >>>", profile);
        onEditPassword();
      } else {
        console.log("error submit!!");
      }
    });
  }
}

async function onEditPassword() {
  store.commit("global/setIsLoading", true);
  try {
    const { username } = profile?.value || {};
    const { password } = form?.value || {};
    const res = await axios({
      url: "/api/auth/changepw",
      method: "post",
      data: {
        username,
        password,
      },
    });
    store.commit("global/setIsLoading", false);
    emit("update:modelValue", false);
    await ElMessageBox.confirm(
      t("please_relogin"),
      t("change_password_success"),
      {
        type: "warning",
        showCancelButton: false,
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false,
      }
    );

    logout();
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}

function logout() {
  router.push({ name: "login" });
  store.commit("global/logout");
}
</script>
