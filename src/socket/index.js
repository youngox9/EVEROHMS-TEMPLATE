import { reactive } from "vue";
import { io } from "socket.io-client";
import { URL_CONFIG } from "@/config";
import store from "@/store";

export const state = reactive({
  connected: false,
  onlineUserCount: 0,
});

export const socket = io(URL_CONFIG.SOCKET);

const logStyle = `"background-color: #FFF176; color: black; font-size: 4px; font-weight: bolder; padding: 0 6px;`;

socket.on("connect", () => {
  const socketState = store?.state?.global?.socket || {};
  state.connected = true;

  store.commit("global/socket", {
    ...socketState,
    connected: true,
    onlineUserCount: 0,
  });
  console.log(`%c[socket] connected`, logStyle);
});

socket.on("onlineUsers", (onlineUserCount) => {
  const socketState = store?.state?.global?.socket || {};
  const oldValue = state.onlineUserCount;
  state.onlineUserCount = onlineUserCount;
  store.commit("global/socket", { ...socketState, onlineUserCount });
  // console.log(
  //   `%c[socket] update onlineUserCount ${oldValue} → ${onlineUserCount}`,
  //   logStyle
  // );
});

socket.on("disconnect", () => {
  const socketState = store?.state?.global?.socket || {};
  state.connected = false;
  state.onlineUserCount = 0;
  store.commit("global/socket", {
    ...socketState,
    connected: true,
    onlineUserCount: 0,
  });
  console.log(`%c[socket] update disconnect`, logStyle);
});
