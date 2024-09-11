<template>
  <Layout :auth="true">
    <teleport to="#portal-target">
      <h2>{{ $t("title_menu") }}</h2>
    </teleport>
    <el-space
      :style="{
        marginBottom: '12px',
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
      }"
    >
      <el-button type="primary" @click="onAdd"
        >新增選單 <el-icon class="el-icon--right"><Plus /></el-icon
      ></el-button>
    </el-space>
    <div class="menu">
      <Container
        group-name="1"
        @drop="onDrop"
        :drag-handle-selector="'.menu-item-drag'"
      >
        <template v-for="item in sortedList" :key="item.id">
          <Draggable>
            <MenuItem :data="item" :onEdit="onEdit" :onDelete="onDelete" />
            <!-- <div class="sub-menu" v-if="item.children.length">
              <Container
                group-name="2"
                @drop="(e) => onDrop(e, item.id)"
                :drag-handle-selector="'.menu-item-drag'"
              >
                <template v-for="subItem in item.children" :key="subItem.id">
                  <Draggable>
                    <MenuItem
                      :data="subItem"
                      :onEdit="onEdit"
                      :onDelete="onDelete"
                    />
                  </Draggable>
                </template>
              </Container>
            </div> -->
          </Draggable>
        </template>
      </Container>
    </div>
  </Layout>
  <MemuItemModal v-model="modalConfig.isOpen" :modalConfig="modalConfig" />
</template>

<script setup>
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { Container, Draggable } from "vue-dndrop";
import { ElNotification, ElMessageBox } from "element-plus";
import { useStore } from "vuex";
import { computed, reactive, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import axios from "@/axios";
import { useState } from "@/utils";
import MemuItemModal from "@/components/MemuItemModal.vue";
import MenuItem from "@/components/MenuItem.vue";

const props = defineProps([]);
const { locale, t } = useI18n();
const store = useStore();

const [navbarList, setNavbarList] = useState([]);
const [modalConfig, setModalConfig] = useState({
  isOpen: false,
  data: {},
  mode: "add",
});

const propsNavbarList = computed(() => {
  return store?.state?.global?.navbarList || [];
});

const sortedList = computed(() => {
  const temp = sortArr(navbarList.value) || [];
  return temp;
});

watch(
  () => modalConfig.value.isOpen,
  (val, prev) => {
    if (val === false) {
      getList();
    }
  },
  { deep: true }
);

// watch(
//   () => propsNavbarList.value,
//   (val, prev) => {
//     setNavbarList(_.cloneDeep(val));
//   },
//   { deep: true }
// );

onMounted(() => {
  getList();
});

/**
 *
 */
async function getList() {
  store.commit("global/setIsLoading", true);

  try {
    const res = await axios({
      url: `/api/auth/get_resource_menulist_all`,
      method: "post",
      data: {
        resource_name: "",
        id: "",
      },
    });
    setNavbarList(res?.data);
    await updateNavbarList();
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}

/**
 *
 */
async function updateNavbarList() {
  store.commit("global/setIsLoading", true);
  try {
    const res = await axios({
      url: `/api/auth/get_resource_menulist`,
      method: "post",
      data: {
        resource_name: "",
        id: "",
      },
    });
    store.commit("global/setNavbarList", res?.data);
  } catch (e) {
    console.log(e);
  }
  store.commit("global/setIsLoading", false);
}

function sortArr(arr = []) {
  const temp = arr.sort((a, b) => a.sort - b.sort);
  const res = temp.reduce((prev, curr, i) => {
    var last = prev[prev.length - 1];
    const children = sortArr(curr.children || []);

    if ((last && last.sort >= curr.sort) || curr.sort === undefined) {
      return [
        ...prev,
        {
          ...curr,
          sort: last.sort + 1,
          children,
        },
      ];
    }
    return [...prev, { ...curr, children }];
  }, []);
  return res;
}

function onAdd() {
  setModalConfig({
    data: null,
    mode: "add",
    isOpen: true,
    list: navbarList.value,
  });
}

function onEdit(item) {
  setModalConfig({
    data: item,
    mode: "edit",
    isOpen: true,
    list: navbarList.value,
  });
}

async function onDelete(data) {
  try {
    await ElMessageBox.confirm(`${t("confirm_delete")}?`, t("warning"), {
      confirmButtonText: t("submit"),
      cancelButtonText: t("cancel"),
      type: "warning",
    });
    store.commit("global/setIsLoading", true);
    try {
      const res = await axios({
        url: `/api/auth/del_resource`,
        method: "post",
        data: {
          ...data,
        },
      });
      await getList();
    } catch (e) {
      console.log(e);
    }
  } catch (e) {}

  store.commit("global/setIsLoading", false);
}

async function onUpdateItem(data) {
  await onUpdate(data);
  await getList();
}

async function onUpdate(data) {
  store.commit("global/setIsLoading", true);
  try {
    const temp = _.pick(data, [
      "id",
      "resource_name",
      "url",
      "sort",
      "parent_id",
      "menu_type",
      "visible",
    ]);
    const res = await axios({
      url: `/api/auth/upd_resource`,
      method: "post",
      showError: false,
      data: {
        ...temp,
      },
    });
  } catch (e) {
    // console.log(e);
  }
  store.commit("global/setIsLoading", false);
}

async function onDrop(e, id) {
  const list =
    (id !== undefined
      ? sortedList.value.find((o) => o.id === id)?.children
      : sortedList.value) || [];

  const { removedIndex, addedIndex } = e;

  if (removedIndex === null && addedIndex === null) return;
  const a = list?.[removedIndex];
  const b = list?.[addedIndex];

  if (!a && !b) return;
  const sortA = a.sort;
  const sortB = b.sort;
  a.sort = sortB;
  b.sort = sortA;

  await onUpdate({ ...a });
  await onUpdate({ ...b });
  await getList();
}
</script>
