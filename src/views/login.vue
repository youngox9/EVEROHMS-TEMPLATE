<template>
  <Layout :auth="false" :showSider="false">
    <div class="login-container">
      <swiper
        class="kv"
        :slides-per-view="3"
        :space-between="50"
        :modules="modules"
        :effect="'fade'"
        :autoplay="{ delay: 2000 }"
        :fadeEffect="{ crossFade: true }"
        :speed="2000"
      >
        <swiper-slide>
          <div
            class="kv-item"
            :style="{
              background: `url(${require('@/assets/kv1.jpg')}) center/cover no-repeat`,
            }"
          />
        </swiper-slide>
        <swiper-slide
          ><div
            class="kv-item"
            :style="{
              background: `url(${require('@/assets/kv2.jpg')}) center/cover no-repeat`,
            }"
          />
        </swiper-slide>
        <swiper-slide
          ><div
            class="kv-item"
            :style="{
              background: `url(${require('@/assets/kv3.jpg')}) center/cover no-repeat`,
            }"
          />
        </swiper-slide>
      </swiper>
      <el-form
        :model="loginForm"
        status-icon
        :rules="rules"
        ref="formEl"
        :label-position="'top'"
        class="form"
      >
        <img class="logo" src="@/assets/logo.png" />
        <el-form-item :label="$t('account')" prop="username">
          <el-input
            type="username"
            v-model="loginForm.username"
            :formatter="(value) => `${value.toUpperCase()}`"
            autocomplete="on"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('password')" prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            autocomplete="on"
          ></el-input>
        </el-form-item>
        <el-form-item :label="'區域'">
          <el-select
            v-model="ENT"
            placeholder="select area"
            @change="setArea"
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-divider :style="{ margin: '24px 0' }" />
        <el-form-item>
          <el-button
            class="submit"
            native-type="submit"
            type="primary"
            size="large"
            @click="submitForm('loginForm')"
            :loading="loading"
          >
            登入
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </Layout>
</template>
<script setup>
import { useStore } from "vuex";
import { ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { Autoplay, EffectFade } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import axios from "@/axios";
import { AREA_OPTIONS, VALIDATIONS, useState } from "@/utils";

import "swiper/css";
import "swiper/css/effect-fade";
//add by ianlo007 增加在線人數統計

const props = defineProps([]);
const emit = defineEmits(["update:isOpen", "isOpen"]);
//
const { t } = useI18n();
const store = useStore();
const router = useRouter();

const [loading, setLoading] = useState(false);
const [loginForm, setLoginForm] = useState({
  // username: "eray",
  // password: "670325",
});
const [options, setOptions] = useState(AREA_OPTIONS);

const rules = reactive({
  username: [VALIDATIONS.isEmpty()],
  password: [VALIDATIONS.isEmpty()],
});

const formEl = ref(null);

const ENT = computed(() => {
  return store?.state?.global?.ENT || "";
});

const modules = computed(() => [EffectFade, Autoplay]);

function setArea(val) {
  store.commit("global/setENT", val);
}

/**
 * 驗證表單
 */
function submitForm() {
  const formObj = formEl.value;
  if (formObj) {
    formObj.validate((valid) => {
      if (valid) {
        onLogin();
      }
    });
  }
}

/**
 * 取得menu list
 */
async function getList() {
  try {
    const res = await axios({
      url: `/api/auth/get_resource_menulist`,
      method: "post",
      showError: false,
      data: {
        resource_name: "",
        id: "",
      },
    });
    return res?.data || [];
  } catch (e) {
    console.log(e);
  }
}

/**
 * 登入
 */
async function onLogin() {
  setLoading(true);
  try {
    const res = await axios({
      auth: true,
      url: "/api/auth/signin",
      method: "post",
      data: {
        ...loginForm.value,
      },
    });
    const profile = res?.data || {};
    store.commit("global/setProfile", profile);
    const menuList = (await getList()) || [];
    const firstUrl = menuList?.[0]?.url;

    if (firstUrl) {
      // 轉導至menu list 第一個
      router.push({ path: firstUrl });
    } else {
      router.push({ name: "index" });
    }
  } catch (e) {
    console.log(">>>>", e);
  }
  setLoading(false);
}
</script>
