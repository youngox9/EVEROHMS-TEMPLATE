<!-- 專門處理所有地方的autocomplete -->
<template>
  <el-popover
    :visible="visible"
    :width="width"
    @before-enter="getData"
    popper-class="auto-complete-popover"
    trigger="hover"
    placement="bottom-start"
    @after-leave="onAfterLeave"
  >
    <template #reference>
      <div
        ref="el"
        class="auto-complete-wrapper"
        @click="setVisible(true)"
        v-click-outside="() => setVisible(false)"
        style="width:100%"
      >
        <slot />
      </div>
    </template>
    <div className="autocomplete-wrap">
      <ul class="autocomplete-list" v-loading="isLoading">
        <!-- <el-input type="text" />
        <el-divider :style="{ margin: '6px 0' }" /> -->
        <li @click="onSelect(opt.value)" v-for="opt in filteredList">
          <template v-if="!slots.content">
            {{ opt.label }}
          </template>
          <slot name="content" :row="opt" />
        </li>

        <el-empty
          v-if="!filteredList.length"
          :description="$t('no_data')"
          :image-size="64"
        />
      </ul>
    </div>
  </el-popover>
</template>
<script setup>
import { useStore } from "vuex";

import {
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
  // defineEmits,
  useSlots,
  onUpdated,
} from "vue";
import { useVModel } from "@vueuse/core";
import { ClickOutside as vClickOutside } from "element-plus";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import _ from "lodash";
import $ from "jquery";
import { useState } from "@/utils";

const emit = defineEmits();

const props = defineProps([
  "form",
  "onFetch",
  "modelValue",
  "onSelect",
  "needFilter",
  "onClose",
]);

const modelValue = useVModel(props, "modelValue", emit);
// const attrs = useAttrs();

const store = useStore();
const router = useRouter();
const { t } = useI18n();

const [isLoading, setIsLoading] = useState(false);
const [visible, setVisible] = useState(false);
const [list, setList] = useState([]);
const [width, setWidth] = useState(100);
const slots = useSlots();
const el = ref();

onMounted(() => {
  $(window).bind("resize", resizePopover);
  const $el = $(el?.value);
  const $input = $el.find("input:not(:disabled), select:not(:disabled)");

  // focus
  $("body").on("focus", $input, onFocus);
  // keydown
  $input.on("close", () => {
    setVisible(false);
  });
});

onUnmounted(() => {
  $(window).unbind("resize", resizePopover);
});

onUpdated(() => {
  resizePopover();
});

watch(
  () => props?.modalValue,
  (val, prev) => {
    // console.log(props);
  },
  { deep: true }
);

function onFocus(e) {
  setVisible(true);
}

function onAfterLeave() {
  if (props?.onClose) {
    props.onClose();
  }
}
/**
 * reisze popover
 */
function resizePopover() {
  if (el?.value?.clientWidth) {
    const w = el.value.clientWidth;
    setWidth(w);
  }
}

const filteredList = computed(() => {
  const { needFilter = true } = props;

  const arr = list?.value || [];
  const val = props?.modelValue || "";

  if (!val) return arr;
  if (!needFilter) return arr;
  return arr.filter((o) => {
    const label = o?.label || "";
    if (label.includes(val)) {
      return true;
    }
    return false;
  });
});

async function getData() {
  if (typeof props?.onFetch === "function") {
    setList([]);
    setIsLoading(true);
    const list = await props.onFetch();
    setIsLoading(false);
    setList(list);
  }
}

function onSelect(val) {
  setVisible(false);
  modelValue.value = val;
  if (props?.onSelect) {
    props.onSelect(val);
  }
}

defineExpose({});
</script>
