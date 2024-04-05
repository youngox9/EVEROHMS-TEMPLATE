<template>
  <div
    class="form-site-footer"
    :style="{ paddingLeft: `${memoNavbarWidth}px` }"
  >
    <div class="footer-content"><slot></slot></div>
  </div>
</template>

<script setup>
import { v4 as uuidv4 } from "uuid";
import { useStore } from "vuex";
import { ref, unref, computed, reactive, watch, toRefs, onMounted } from "vue";
import { ElNotification } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import _, { keysIn } from "lodash";
import axios from "@/axios";
import { VALIDATIONS, useState, axiosExcel, saveExcel } from "@/utils";
import moment from "moment";
import { useLocalStorage } from "@vueuse/core";

const memoNavbarWidth = useLocalStorage("memoNavbarWidth", 200);

// 欄位設定
const FIELD_SETTING = {
  SFFB002: {
    disabled: false,
  },
};

const INITIAL_PAGECONFIG = { page: 1, total: 1, pageSize: 1 };
const props = defineProps([]);
//const props = defineProps(["isOpen", "siteData"]);
const { t } = useI18n();
const store = useStore();
const router = useRouter();
const route = useRoute();

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

const searchForm = computed(() => {
  return store?.state?.global?.searchForm || {};
});

const formRef1 = ref();
const formRef2 = ref();

const [form1, setForm1] = useState({
  //SFFB005: "K-ACRA-2209050001",
});
const [form2, setForm2] = useState({});

const [isSearch, setIsSearch] = useState(false);
const [drawer, setDrawer] = useState(false);
const [modalOpen, setModalOpen] = useState(false);
const rules1 = reactive({
  SFFB005: [
    VALIDATIONS.isEmpty(),
    {
      min: 17,
      max: 17,
      message: "單號長度為17碼,請輸入正確的單號",
      trigger: "blur",
    },
  ],
});

const rules2 = reactive({
  //SFIA001: [VALIDATIONS.isEmpty()],
});

const [list, setList] = useState([]);

onMounted(() => {
  querySearch();
});

const isLoading = computed(() => store?.state?.global?.isLoading || false);

const fields = computed(() => {
  const f = form2?.value || {};
  const keys = Object.keys(_.omit(f, []));
  console.log(keys);
  return keys;
});

const profile = computed(() => {
  return store?.state?.global?.profile || {};
});

async function onSearch() {
  const formObj = formRef1.value;
  if (formObj) {
    formObj.validate((valid) => {
      if (valid) {
        getData();
      } else {
        console.log("error submit!!");
      }
    });
  }
}
async function getData() {
  store.commit("global/setIsLoading", true);
  try {
    const res = await axios({
      url: `/common/sfc/asft331_get01`,
      method: "post",
      data: {
        ENT: ENT.value,
        ...form1.value,
        USERID: profile.value.username,
      },
    });

    if (res?.data?.length) {
      const data = res?.data?.[0];
      setIsSearch(true);
      setForm2({
        ...data,
      });
      onSave();
    } else {
      setIsSearch(false);
      setForm2({});
      ElNotification({
        title: "Error",
        message: "查無報工資料",
        type: "error",
      });
    }
  } catch (e) {
    console.log(e);
    setIsSearch(false);
    setForm2({});
  }
  store.commit("global/setIsLoading", false);
}

function onSubmit() {
  const formObj = formRef2.value;

  if (formObj) {
    formObj.validate((valid) => {
      if (valid) {
        onSave();
      } else {
        console.log("error submit!!");
      }
    });
  }
}

async function onSave() {
  store.commit("global/setIsLoading", true);
  try {
    const res = await axios({
      url: `/common/sfc/asft331_save01`,
      method: "post",
      data: {
        ...form1.value,
        ...form2.value,
        // 報廢數量
        ENT: ENT.value,
        USERID: profile.value.username,
      },
    });
    const msg = res?.data?.v_message || "";
    setIsSearch(false);
    ElNotification({
      title: t("success"),
      message: msg || "存檔成功",
      type: "success",
    });
    //resetForm();
    setForm1({});
    //setForm2({});
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}

function resetForm() {
  //store.commit("global/setSearchForm", {});
  store.commit("global/setIsSearch", false);
  //window.dispatchEvent(new Event("SITE_RESET"));
}

/** autocompolete 下拉選單 */
async function querySearch() {
  const res = await axios({
    url: `/common/sfc/csft335_get_sfaadocno_movein`,
    method: "post",
    data: {
      ENT: ENT.value,
      SFFB007: "",
      SFFB009: "",
    },
    showError: false,
  });

  const data = res?.data;
  const result = data.map((obj) => {
    return {
      value: obj.SFAADOCNO,
      link: `${obj.SFFB009}/${obj.SFFB007}`,
    };
  });
  // cb(result);
  setList(result);
}

async function getAutoList() {
  try {
    const res = await axios({
      url: "/common/sfc/csft335_get_sfaadocno_movein",
      method: "post",
      showError: false,
      showLoading: false,
      data: {
        ENT: ENT.value,
      },
    });

    const data = res?.data || [];
    const result = data.map((obj) => {
      return {
        value: obj.SFAADOCNO,
        label: obj.SFAADOCNO,
        link: `${obj.SFAADOCNO}  ${obj.SFFB009}/${obj.SFFB007} `,
      };
    });
    return result.map((obj) => ({ label: obj.link, value: obj.value }));
  } catch (e) {
    console.log(">>>>>>>>>>", e);
  }
  return [];
}

// function onChange() {
//   store.commit("global/setSearchForm", {});
//   store.commit("global/setIsSearch", false);
// }
</script>
