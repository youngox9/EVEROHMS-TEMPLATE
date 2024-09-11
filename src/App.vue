<template>
  <div class="loading" :class="isLoading ? 'active' : ''"></div>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script setup>
import { useStore } from "vuex";
import { computed, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import $ from "jquery";

const props = defineProps([]);
const { t } = useI18n();
const store = useStore();

const isLoading = computed(() => store?.state?.global?.isLoading);

onMounted(() => {
  // 自動跳到表單下一個欄位
  $("body").on(
    "keydown",
    "input:not(:disabled), select:not(:disabled)",
    onInputKeydown
  );

  // 自動把卷軸滾到錯誤的那一個欄位
  $("body").on("submit", "form", onScrollToError);
});

onUnmounted(() => {
  $("body").off(
    "keydown",
    "input:not(:disabled), select:not(:disabled)",
    onInputKeydown
  );
  $("body").off("submit", "form", onScrollToError);
});

/**
 * 處理input按下tab或enter時的觸發事件
 */
function onInputKeydown(e) {
  if (isLoading.value) {
    // console.log("is loading! break");
    return;
  }

  const keyCode = e.which;
  // 按下 [Tab]
  if (keyCode === 9) {
    e.preventDefault();
    const $this = $(this);
    $this.click();
  }
  // 按下 [Enter]
  else if (keyCode === 13) {
    e.preventDefault();
    const $this = $(this);
    const form = $this.parents("form:eq(0)");
    const allInput = form.find("input:not(:disabled), select");
    const index = allInput.index(this);
    const next = allInput.eq(index + 1);

    if (next.length) {
      $this.trigger("close");
      next.focus();
      next.click();
    } else {
      const $dialog = $this.parents(".el-dialog:eq(0)");
      const $dialogSubmit = $dialog.find('[type="submit"]');
      const $formSubmit = form.find('[type="submit"]');
      const $submit = $formSubmit.length ? $formSubmit : $dialogSubmit;
      const isDisabled = $submit.is(":disabled");

      // const $submit = $dialogSubmit;
      if ($submit.length && !isDisabled) {
        $submit.click();
      }
    }
    // return false;
  }
}

/**
 * 按下submit時，畫面移到紅字欄位
 */
function onScrollToError() {
  setTimeout(() => {
    const $error = $(".is-error").eq(0);
    if ($error.length) {
      $error[0].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, 0);
}
</script>
