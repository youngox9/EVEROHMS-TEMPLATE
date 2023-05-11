<template>
  {{ $attrs.modelValue.isOpen }}
  <el-dialog
    v-bind="{ ...$attrs, ...$props }"
    v-model="$attrs.modelValue.isOpen"
    :title="modalTitle"
  >
    <template v-for="(index, name) in $slots" v-slot:[name]>
      <slot :name="name" />
    </template>
  </el-dialog>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, unref, computed, reactive, watch, toRefs, useAttrs } from "vue";

import { useI18n } from "vue-i18n";

const attrs = useAttrs();
const props = defineProps([]);
const { locale, t } = useI18n();
const store = useStore();

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

const profile = computed(() => {
  return store?.state?.global?.profile || {};
});

const modalTitle = computed(() => {
  const { mode = "add", title = "" } = attrs?.modelValue || {};
  if (mode === "edit") {
    return `${t("edit")} ${title}`;
  } else {
    return `${t("add")} ${title}`;
  }
});

watch(
  () => [props.isOpen],
  (val) => {},
  { deep: true }
);
</script>
