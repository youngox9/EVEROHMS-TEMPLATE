<template>
  <el-dialog
    :draggable="true"
    width="400px"
    :title="'修改短工號'"
    :append-to-body="true"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    :destroy-on-close="true"
    :before-close="() => $emit('update:modelValue', false)"
  >
    <el-form ref="formEl" :model="form" :rules="rules" :label-position="'top'">
      <el-form-item :label="$t('OOAG014')" prop="OOAG014">
        <el-input
          v-model="form.OOAG014"
          type="text"
          :placeholder="$t('OOAG014')"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="() => $emit('update:modelValue', false)">{{
          $t('cancel')
        }}</el-button>
        <el-button type="primary" @click="() => submitform()"
          >{{ $t('submit') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { useStore } from 'vuex';
import { ref, computed, reactive, watch, useAttrs } from 'vue';
import { ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import axios from '@/axios';
import { VALIDATIONS, useState } from '@/utils';

const attrs = useAttrs();
const router = useRouter();

const props = defineProps([]);
// const emit = defineEmits(["update:isOpen", "isOpen"]);
const { t } = useI18n();
const store = useStore();

const form = reactive({
  OOAG014: '',
});
// const [form, setForm] = useState({
//   OOAG014: '',
// });

const rules = reactive({
  OOAG014: [VALIDATIONS.isEmpty()],
});

const formEl = ref(null);

const emit = defineEmits(['update:modelValue']);

// onMounted(() => {

// });

const globalStore = computed(() => store?.state?.global || {});

watch(
  () => [attrs.modelValue],
  (val) => {
    const [isOpen] = val;
    if (isOpen) {
      form.OOAG014 = globalStore.value?.profile?.username;
    } else {
      const formObj = formEl?.value;
      if (formObj) {
        formObj.resetFields();
      }
    }
  },
  { deep: true }
);

async function submitform() {
  const formObj = formEl?.value;
  if (formObj) {
    await formObj.validate((valid, fields) => {
      if (valid) {
        onSubmit();
      } else {
        console.log('error submit!!');
      }
    });
  }
}

async function onSubmit() {
  store.commit('global/setIsLoading', true);
  try {
    const { OOAG014 } = form?.value || {};
    const res = await axios({
      url: '/api/auth/changeshortid',
      method: 'post',
      data: {
        OOAG014,
        ENT: globalStore?.value?.ENT,
        USERID: globalStore?.value?.profile?.username,
      },
    });
    store.commit('global/setIsLoading', false);
    emit('update:modelValue', false);
    await ElMessageBox.confirm(
      t('please_relogin'),
      t('change_password_success'),
      {
        type: 'warning',
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
  store.commit('global/setIsLoading', false);
}

function logout() {
  router.push({ name: 'login' });
  store.commit('global/logout');
}
</script>
