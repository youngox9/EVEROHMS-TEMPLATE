<template>
  <el-form-item :prop="config.fieldKey" :label="$t(config.fieldKey)">
    <!-- 日期選擇器 -->
    <el-date-picker
      v-if="config.type === 'date'"
      type="date"
      :style="{ width: '100%' }"
      format="YYYY-MM-DD"
      value-format="YYYY-MM-DD"
      placement="bottom"
      v-bind="{ ...$attrs, ...$props }"
    />
    <!-- 下拉選單 -->
    <el-select
      v-else-if="config.type === 'select'"
      :placeholder="$t(config.fieldKey)"
      v-bind="{ ...$attrs, ...$props }"
    >
      <el-option
        v-for="item in config?.options || []"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <!-- textarea -->
    <el-input
      v-else-if="config.type === 'textarea'"
      autosize
      type="textarea"
      :placeholder="$t(config.fieldKey)"
      v-bind="{ ...$attrs, ...$props }"
    />
    <el-input v-else :placeholder="$t(config.fieldKey)" />
  </el-form-item>
  <!-- {{ $attrs }} -->
</template>

<script setup>
import { useStore } from "vuex";
import { computed, useAttrs } from "vue";

import { useI18n } from "vue-i18n";

const attrs = useAttrs();
const props = defineProps(["config", "modelValue"]);
const { locale, t } = useI18n();
const store = useStore();

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

const profile = computed(() => {
  return store?.state?.global?.profile || {};
});
</script>
