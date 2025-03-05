<template>
  <el-button v-if="profile.accessToken" ref="buttonRef" link>
    <el-icon class="avatar">
      <v-icon name="fa-user-circle" scale="1.12" />
    </el-icon>
    <span>{{ profile?.username }}</span>
    <!-- 20230204 add by ianlo007 增加中文名顯示 -->
    <span>{{ profile?.user_name }}</span>
  </el-button>
  <el-popover
    ref="popoverRef"
    :virtual-ref="buttonRef"
    trigger="click"
    virtual-triggering
    placement="bottom-end"
    width="300px"
  >
    <div class="profile-box">
      <div :style="{ justifyContent: 'space-between', display: 'flex' }">
        <el-space nowrap>
          <AreaButton />
          <OnlinePeopleButton />
        </el-space>
        <ErrorListButton />
      </div>

      <el-divider />
      <div class="profile-card">
        <div class="profile-avatar" :style="{ backgroundImage: `` }" />
        <div class="username">
          {{ profile?.username }}
        </div>
        <p>{{ profile?.email }}</p>
      </div>
      <el-divider />
      <div class="profile-menu">
        <el-button
          plain
          type="primary"
          @click="() => (modal1Open = !modal1Open)"
        >
          {{ $t('change_password') }}
        </el-button>
        <el-button
          plain
          type="warning"
          @click="() => (modal2Open = !modal2Open)"
        >
          {{ $t('change_short_id') }}
        </el-button>
        <el-button size="small" link @click="logout()">
          {{ $t('logout') }}
        </el-button>
      </div>
    </div>
  </el-popover>
  <PasswordModal v-model="modal1Open" />
  <ShortIDModal v-model="modal2Open" />
</template>

<script setup>
import { useStore } from 'vuex';
import { ref, unref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useState } from '@/utils';
import {
  GlobalButton,
  ErrorListButton,
  ThemeButton,
  MenuItem,
  AreaButton,
  OnlinePeopleButton,
  ProfileButton,
} from '@/components/Navbar';

import PasswordModal from './PasswordModal.vue';
import ShortIDModal from './ShortIDModal.vue';

const store = useStore();
const router = useRouter();
// const [modalOpen, setModalOpen] = useState(false);
const [modal1Open] = useState(false);
const [modal2Open] = useState(false);

const profile = computed(() => {
  return store?.state?.global?.profile || {};
});

const buttonRef = ref();
const popoverRef = ref();

function logout() {
  store.commit('global/logout');
  router.push({ name: 'login' });
}
</script>
