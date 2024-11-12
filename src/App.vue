<template>
  <DownloadQueryList v-if="downloadList.length" />
  <div class="loading" :class="isLoading ? 'active' : ''"></div>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script setup>
import { useStore } from 'vuex';
import { computed, onMounted, onUnmounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import $ from 'jquery';
import { useRoute } from 'vue-router';

import axios from '@/axios';

import DownloadQueryList from '@/components/DownloadQueryList.vue';
import router from './router';

const props = defineProps([]);
const { t } = useI18n();
const store = useStore();
const route = useRoute();

const isLoading = computed(() => store?.state?.global?.isLoading);

const downloadList = computed(() => store?.state?.global?.downloadList);

onMounted(() => {
  // 自動跳到表單下一個欄位
  $('body').on(
    'keydown',
    'input:not(:disabled), select:not(:disabled)',
    onInputKeydown
  );

  // 自動把卷軸滾到錯誤的那一個欄位
  $('body').on('submit', 'form', onScrollToError);
});

onUnmounted(() => {
  $('body').off(
    'keydown',
    'input:not(:disabled), select:not(:disabled)',
    onInputKeydown
  );
  $('body').off('submit', 'form', onScrollToError);
});

const globalStore = computed(() => store?.state?.global || {});

watch(route, () => {
  onRouterChange();
});

async function onRouterChange() {
  const path = router?.currentRoute?.value?.path;
  console.log(path);
  if (path) {
    const res = await axios({
      url: '/aoo/weblogin_save01',
      method: 'post',
      auth: true,
      data: {
        ENT: globalStore?.value?.ENT,
        USERID: globalStore?.value?.profile?.username,
        SYSNAME: 'SFC',
        URL: path,
      },
    });
  }
}

/**
 * 處理input按下tab或enter時的觸發事件
 */
function onInputKeydown(e) {
  const path = router?.currentRoute?.value?.path;
  console.log('path >>>', path);
  if (isLoading.value) {
    // console.log("is loading! break");
    return;
  }

  // keycode
  // [9] : tab
  // [13] : enter
  const allowedKeys = path === '/login' ? [9, 13] : [13];
  if (allowedKeys.includes(e.which)) {
    e.preventDefault();
    const $this = $(this);

    const form = $this.parents('form:eq(0)');
    const allInput = form.find('input:not(:disabled), select');
    const index = allInput.index(this);
    const next = allInput.eq(index + 1);

    if (next.length) {
      $this.trigger('close');
      next.focus();
      next.click();
    } else {
      const $dialog = $this.parents('.el-dialog:eq(0)');
      const $dialogSubmit = $dialog.find('[type="submit"]');
      const $formSubmit = form.find('[type="submit"]');
      const $submit = $formSubmit.length ? $formSubmit : $dialogSubmit;
      const isDisabled = $submit.is(':disabled');

      if ($submit.length && !isDisabled) {
        $submit.click();
      }
    }
  }
}

/**
 * 按下submit時，畫面移到紅字欄位
 */
function onScrollToError() {
  setTimeout(() => {
    const $error = $('.is-error').eq(0);
    if ($error.length) {
      $error[0].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }, 0);
}
</script>
