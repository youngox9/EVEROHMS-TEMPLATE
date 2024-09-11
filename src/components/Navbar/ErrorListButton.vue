<template>
  <el-tooltip content="API錯誤紀錄" placement="bottom">
    <el-button size="small" type="danger" plain @click="() => setVisible(true)">
      <el-icon class="el-icon--left">
        <v-icon name="md-erroroutline" />
      </el-icon>
      錯誤紀錄
    </el-button>
  </el-tooltip>

  <el-drawer
    v-model="visible"
    append-to-body
    destroy-on-clos
    title="API錯誤紀錄"
  >
    <el-table
      :data="errorMsgList.reverse()"
      style="width: 100%"
      size="small"
      max-height="80vh"
    >
      <el-table-column prop="title" label="標題" />
      <el-table-column prop="msg" label="內文" />
      <el-table-column prop="time" label="時間">
        <template #default="scope">
          {{
            moment(scope?.row?.[scope?.column?.property]).format(
              "YYYY/MM/DD/HH:mm:ss"
            )
          }}
        </template>
      </el-table-column>
      <el-table-column prop="url" label="API URL" />
    </el-table>
  </el-drawer>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, unref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useState } from "@/utils";
import moment from "moment";

const store = useStore();
const router = useRouter();

const [visible, setVisible] = useState(false);

const errorMsgList = computed(() => store?.state?.global?.errorMsgList || []);
</script>
