<!-- 報工站表單樣板 -->
<template>
  <!-- 表單內容 -->
  <div
    class="form-site"
    v-show="isSearch"
    v-bind:class="{ 'is-edit': siteMode === 'edit' }"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="form"
      status-icon
      @submit.prevent="
        (e) => {
          e.preventDefault();
          return false;
        }
      "
      :label-position="'top'"
      validate-on-rule-change
    >
      <!-- 標題 -->
      <h3>
        {{ form.SFFB009 }} / {{ form.SFFB009_DESC }} /
        <span class="text-red">{{ form.SFFB007_DESC }}</span>
        <span class="text-gray">{{ form.SFCB009_DESC }}</span>
      </h3>

      <!-- 右上方工具按鈕 -->
      <div class="bad-reason">
        <el-space>
          <PCBButton
            v-if="showPCB"
            ref="pcbButton"
            :data="form"
            :force="needPCB"
            :onAddItem="() => setNeedPCB(false)"
          />
          <AOIandCCDButton :data="form" />
          <BadReasonButton :data="form" />
          <CuttingButton :data="form" />
          <MelfButton :data="form" />
        </el-space>
      </div>
      <!-- 表單開始 -->
      <el-row :gutter="12">
        <el-col :xs="24" :sm="4">
          <!-- 報工單號 -->
          <el-form-item :label="$t('SFFBDOCNO')">
            <el-input type="text" v-model="form.SFFBDOCNO" disabled></el-input>
            <!-- 生產數量 -->
            <p class="form-item-info">
              {{ $t("SFAA012") }}{{ form.SFAA012 }}{{ form.SFAA013 }}
            </p>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="4">
          <!-- Run Card -->
          <el-form-item :label="$t('SFFB006')">
            <el-input type="text" v-model="form.SFFB006" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="4">
          <!-- 作業編號 -->
          <el-form-item :label="$t('SFFB007')">
            <el-input type="text" v-model="form.SFFB007" disabled></el-input>
            <!-- 作業編號說明 -->
            <p class="form-item-info" v-if="form.SFFB007 == '1400'">
              {{ $t("OOCQ032") }} {{ form.OOCQ032 }}
            </p>
          </el-form-item>
        </el-col>
        <!-- 報工料號 -->
        <el-col :xs="24" :sm="4">
          <el-form-item :label="$t('SFFB029')">
            <el-input type="text" v-model="form.SFFB029" disabled></el-input>
            <!-- 料號說明 -->
            <p class="form-item-info">{{ form.SFB029_DESC1 }}</p>
            <p class="form-item-info">{{ form.SFB029_DESC2 }}</p>
          </el-form-item>
        </el-col>
        <!-- 工單狀態 -->
        <el-col :xs="24" :sm="4">
          <el-form-item :label="$t('SFFBSTUS')" prop="SFFBSTUS">
            <el-select
              v-model="form.SFFBSTUS"
              value-key="SFFBSTUS"
              :style="{ width: '50%' }"
            >
              <el-option :key="N" :label="'未確認'" :value="'N'" />
              <el-option
                :key="Y"
                :label="'已確認'"
                :value="'Y'"
                disabled="disabled"
              />
              <el-option
                :key="H"
                :label="'REJECT'"
                :value="'H'"
                style="color: red"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :xs="24" :sm="4">
        <el-form-item :label="$t('SFFBSTUS')">
          <el-input
            type="text"
            v-model="form.SFFBSTUS"
            disabled
          ></el-input>
        </el-form-item>
      </el-col> -->
      </el-row>
      <el-row :gutter="12">
        <el-col :xs="24" :sm="12">
          <!-- 報工人員 -->
          <el-form-item :label="$t('SFFB002')" prop="SFFB002">
            <el-input
              type="text"
              v-model="form.SFFB002"
              :formatter="(value) => `${value.toUpperCase()}`"
            >
            </el-input>

            <p class="form-item-info">{{ userName }}</p>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8">
          <!-- 報工機器 -->
          <el-form-item :label="$t('SFFB010')" prop="SFFB010">
            <Autocomplete v-model="form.SFFB010" :onFetch="getMachineList"
              ><el-input
                type="text"
                v-model="form.SFFB010"
                :formatter="(value) => `${value.toUpperCase()}`"
              />
            </Autocomplete>
          </el-form-item>
          <!-- <el-input
          type="text"
          :formatter="(value) => `${value.toUpperCase()}`"
          :parser="(value) => value"
          v-model="form.SFFB010"
          :placeholder="$t('SFFB010')"
          :fetch-suggestions="getMachineList"
          @select="() => {}"
        /> -->
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <!-- 良品數量/待處理量系列 -->
        <SFFB017Inputs :form="form" ref="SFFB017InputsObj" />

        <!-- 動態欄位 -->
        <DynamicFields :form="form" />

        <!-- AIO/DDC checkboxs -->
        <AOIandCCDCheckbox :data="form" />

        <!-- 備註 -->
        <el-col :xs="24" :sm="24">
          <el-form-item :label="$t('SFFB023')" prop="SFFB023">
            <el-input
              autosize
              v-model="form.SFFB023"
              :placeholder="$t('SFFB023')"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <slot />
    </el-form>
    <FormSiteFooter class="form-site-footer">
      <el-tooltip
        :visible="saveDisabled"
        placement="top"
        :content="$t('SFFEUC003_more_than_450')"
      >
        <el-button
          type="primary"
          size="large"
          @click="submitForm"
          native-type="submit"
          :disabled="formDisabled"
        >
          {{ $t("save") }}
        </el-button>
      </el-tooltip>
    </FormSiteFooter>
  </div>
  <!-- NO NODATA -->
  <el-empty :image-size="200" v-show="!isSearch" />
</template>
<script setup>
import { useStore } from "vuex";
import { ElMessageBox } from "element-plus";
import { ref, computed, reactive, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import _ from "lodash";
import axios from "@/axios";
import { VALIDATIONS, useState } from "@/utils";

import {
  AOIandCCDButton,
  BadReasonButton,
  CuttingButton,
  PCBButton,
  DynamicFields,
  SFFB017Inputs,
  AOIandCCDCheckbox,
  MelfButton,
} from "@/views/site/components";

import Autocomplete from "@/components/Autocomplete.vue";

const props = defineProps([
  "form",
  "setForm",
  "onSave", // 驗證表單後呼叫
  "check_SFFEUC003", // 是否需要檢查膏品數量
  "showPCB", // 是否要檢查PCB, 若開啟會[檢查是否為第一站] [檢查是否強制開啟PCB MODAL] [顯示PCB按鈕]
]);

const store = useStore();
const router = useRouter();
const { t } = useI18n();
const formRef = ref();
const SFFB017InputsObj = ref(null);
const pcbButton = ref();

const emit = defineEmits();

const ENT = computed(() => store?.state?.global?.ENT || "");

const siteMode = computed(() => store?.state?.global?.siteMode || "search");

const isSearch = computed(() => store?.state?.global?.isSearch || false);

const isLoading = computed(() => store?.state?.global?.isLoading || false);

/** 膏品數量超過450時卡控不可以存檔 20230316 add by ianlo007 */
const saveDisabled = computed(() => {
  const { check_SFFEUC003 } = props;
  if (check_SFFEUC003) {
    const role_id = store?.state?.global?.profile?.role_id || "";
    const SFFEUC003 = parseFloat(props?.form?.value?.SFFEUC003 || 0);
    //if (role_id === 6) return false;
    return SFFEUC003 > 400;
  }
  return false;
});

const formDisabled = computed(() => saveDisabled.value || isLoading.value);

const garbageCount = computed(() => {
  const a = parseFloat(props?.form?.SFFB017) || 0;
  const b = parseFloat(props?.form?.SFFB017_1) || 0;
  if (b < 0) {
    return 0;
  }
  const val = a - b > 0 ? a - b : 0;
  const v = parseFloat(val.toFixed(12));
  return v;
});

const [userName, setUserName] = useState("");
const [needPCB, setNeedPCB] = useState(false);

const rules = reactive({
  // 報工人員
  SFFB002: [
    VALIDATIONS.isEmpty(),
    { min: 10, max: 11, message: "工號10-11碼", trigger: "blur" },
  ],
  // 報工機器
  SFFB010: [
    VALIDATIONS.isEmpty(),
    VALIDATIONS.custom(async (rule, value, callback) => {
      store.commit("global/setIsLoading", true);
      try {
        const res = await axios({
          url: "/common/sfc/csft335_sffb010_chk01",
          method: "post",
          showError: false,
          data: {
            ENT: ENT.value,
            SFFB009: props.form.SFFB009,
            SFFB005: props.form.SFFB005,
            SFFB007: props.form.SFFB007,
            SFFB010: value,
          },
        });
        const result = res?.data === "OK";

        if (result) {
          callback();
        } else {
          callback(new Error("機台輸入錯誤"));
        }
      } catch (e) {
        console.log(e);
        callback(new Error("機台輸入錯誤"));
      }
      store.commit("global/setIsLoading", false);
    }, "blur"),
  ],
  // 良品數量
  SFFB017_1: [
    VALIDATIONS.isEmpty(),
    VALIDATIONS.custom((rule, value, callback) => {
      const { SFFB017, SFFB017_MAX, SFAA012 } = props?.form || {};
      const a = parseFloat(value);
      const b = SFFB017 ? parseFloat(SFFB017) : false;
      const c = SFFB017_MAX ? parseFloat(SFFB017_MAX) : false;
      const d = SFAA012 ? parseFloat(SFAA012) : false;
      const isInValid = c && a > c; //20221212 modify by ianlo007
      //const isInValid2 = ((a/d)<0.8); //20221223 modify by ianlo007

      if (isInValid) {
        callback(new Error("良品數量不可大於良品數上限"));
      } else {
        // if (isInValid2) {
        //   ElMessageBox.confirm("總良率低於80%,確認要存檔", t("warning"), {
        //   confirmButtonText: t("submit"),
        //   cancelButtonText: t("cancel"),
        //   type: "warning",
        // })

        //   //callback(new Error("總良率低於80%"));
        //   //未來要列印QRcode貼在工單上面 ianlo007 20221221
        // }
        // else{
        //   callback();
        // }
        callback();
      }
    }),
  ],

  // Ni 安培
  SFFBUA001: [
    VALIDATIONS.isEmpty(),
    VALIDATIONS.custom((rule, value, callback) => {
      const a = parseFloat(value);
      if (a == 0) {
        callback(new Error("Ni安培不能為0"));
      } else {
        callback();
      }
    }),
  ],
  // Sn 安培
  SFFBUA002: [
    VALIDATIONS.isEmpty(),
    VALIDATIONS.custom((rule, value, callback) => {
      const a = parseFloat(value);
      if (a == 0) {
        callback(new Error("Sn安培不能為0"));
      } else {
        callback();
      }
    }),
  ],
  // Ni 分鐘
  SFFBUA003: [
    VALIDATIONS.isEmpty(),
    VALIDATIONS.custom((rule, value, callback) => {
      const a = parseFloat(value);
      if (a == 0) {
        callback(new Error("Ni分鐘不能為0"));
      } else {
        callback();
      }
    }),
  ],
  // Sn 分鐘
  SFFBUA004: [
    VALIDATIONS.isEmpty(),
    VALIDATIONS.custom((rule, value, callback) => {
      const a = parseFloat(value);
      if (a == 0) {
        callback(new Error("Sn分鐘不能為0"));
      } else {
        callback();
      }
    }),
  ],
  // 鐵珠重量
  SFFBUA005: [
    VALIDATIONS.isEmpty(),
    VALIDATIONS.custom((rule, value, callback) => {
      const a = parseFloat(value);
      if (a == 0) {
        callback(new Error("鐵珠重量不能為0"));
      } else {
        callback();
      }
    }),
  ],
  // 膏品料號
  SFFEUC002: [VALIDATIONS.isEmpty()],
  // 膏品數量
  SFFEUC003: [VALIDATIONS.isEmpty()],
  // 膏品批號
  SFFEUC004: [VALIDATIONS.isEmpty()],
  //良品重量
  SFFBUD019: [VALIDATIONS.isEmpty()],
  //容差下限
  SFFBUS001: [VALIDATIONS.isEmpty()],
  //容差上限
  SFFBUS002: [VALIDATIONS.isEmpty()],
});

onMounted(() => {
  const { showPCB = false } = props;
  const obj = formRef.value;
  obj.clearValidate();

  if (showPCB) {
    getFirstStationCheck();
  }
});
onUnmounted(() => {});

watch(
  () => props?.form?.SFFB002,
  (val) => {
    getUserName(val);
  }
);

watch(
  () => store?.state?.global?.searchForm,
  (val = {}) => {
    if (typeof props?.setForm === "function") {
      props.setForm(val);
    }
  },
  { deep: true, immediate: true }
);

/**
 * 強制打開PCB
 */
function forcePCB() {
  if (typeof pcbButton?.value?.setModalOpen === "function") {
    pcbButton.value.setModalOpen(true);
  }
}

/**
 * 檢查是否為第一站：如果是回傳為Y就一訂要輸入PCB基板資料
 */
async function getFirstStationCheck() {
  setNeedPCB(false);
  store.commit("global/setIsLoading", true);
  try {
    const res = await axios({
      url: `/csft335common/sfc/csft335_FirstStation_chk01`,
      method: "post",
      data: {
        ENT: ENT.value,
        SFAADOCNO: props?.form?.SFFB005,
      },
    });
    if (res.data === "Y") {
      setNeedPCB(true);
      forcePCB();
    } else {
      setNeedPCB(false);
    }
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}

/**
 * 取得使用者名稱
 * @param {} val SFFB002, 工號
 */
async function getUserName(val) {
  try {
    if (val)
      if (val?.length < 10) {
        setUserName("");
      } else {
        const res = await axios({
          url: "/common/sfc/getcnname",
          method: "post",
          showError: false,
          showLoading: false,
          data: {
            ENT: ENT.value,
            username: val,
          },
        });
        const data = res?.data || [];
        const temp = data?.[0]?.OOAG011 || data?.[0]?.username || "";
        setUserName(temp);
      }
  } catch (e) {}
}
async function getMachineList() {
  try {
    const res = await axios({
      url: "/csft335common/sfc/csft335_sffb010_get01",
      method: "post",
      showError: false,
      showLoading: false,
      data: {
        ENT: ENT.value,
        SFAADOCNO: props.form.SFFB005,
        SFFB007: props.form.SFFB007,
        SFFBSTUS: siteMode.value === "edit" ? "Y" : "N",
      },
    });

    const data = res?.data || [];

    const list = data.map((obj) => {
      const val = obj.MRBI002 || "";
      return { value: val, label: val };
    });
    return list;
  } catch (e) {}
  return [];
}

async function submitForm() {
  store.commit("global/setIsLoading", true);
  const formObj = formRef?.value;

  const { showPCB = false, onSave = () => {} } = props;
  const { openForceReasonModal = () => {} } = SFFB017InputsObj?.value || {};

  if (formObj) {
    formObj.validate(async (valid) => {
      // 驗證完表單後，先檢查是否需要新增PCB
      if (valid) {
        if (showPCB && needPCB.value) {
          try {
            await ElMessageBox.confirm(`請新增${t("pcb")}`, t("warn"), {
              confirmButtonText: t("submit"),
              // cancelButtonText: "Cancel",
              type: "warning",
            });
            // 如果沒填PCB就強制打PCB MODAL
            forcePCB();
          } catch (e) {
            console.log(e);
          }
        } else {
          // 確認報廢數量，不通過就打開強制輸入原因
          const isBadReasonValid = await checkBadReason();
          if (isBadReasonValid) {
            await onSave();
          } else {
            openForceReasonModal(true);
          }
        }
      } else {
        store.commit("global/setIsLoading", false);
      }
    });
  }
}

/**
 * 檢查是否需要強制輸入原因
 */
async function checkBadReason() {
  const val = props?.form?.SFFB017_1;
  try {
    const { ENT } = store?.state?.global || {};
    const { SFFB018, SFFBDOCNO } = props?.form || {};
    const res = await axios({
      url: `/csft335common/sfc/csft335_badreason_chk01`,
      method: "post",
      data: {
        ENT,
        SFFB018: garbageCount.value,
        SFFBDOCNO,
      },
    });
    const result = res?.data || "OK";
    console.log(result);
    return result === "OK";
  } catch (e) {
    console.log("e >>>", e);
  }
  return false;
}

defineExpose({ formRef, SFFB017InputsObj });
</script>
