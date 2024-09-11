import { v4 as uuidv4 } from "uuid";
import { SEARCHBAR_AUTOCOMPLETE_LIST } from "@/utils";
import router from "@/router";
import i18nJSON from "@/i18n/lib.js";

function getProfile() {
  try {
    return JSON.parse(localStorage.getItem("auth"));
  } catch (e) {
    console.log(e);
  }
  return { accessToken: "", email: "", id: "", roles: [], username: "" };
}

const INITIAL_STATE = () => ({
  isLoading: false,
  profile: getProfile(),
  lang: localStorage.getItem("lang") || "zh_tw",
  ENT: localStorage.getItem("ENT") || "20",
  langList: [...Object.keys(i18nJSON)] || [],
  navbarList: [],
  searchForm: {
    //SFFB005: "K-CMAF-2302130037",
    // SFFB005: "K-ACRB-2212090009",
  },
  siteMode: "search",
  isSearch: false,
  isMenuOpen: false,
  downloadList: [],
  selectedList: {},
  errorMsgList: [],
  STUS: { STUS: "N" },
  env: process.env.NODE_ENV,
  socketState: {
    connected: false,
    onlineUserCount: 0,
  },
});

export default {
  namespaced: true,
  state: INITIAL_STATE(),
  actions: {},
  mutations: {
    logout(state) {
      window.localStorage.clear();
      router.push("login");
      Object.assign(state, INITIAL_STATE());
    },
    setProfile(state, profile) {
      state.profile = profile;
      // console.log("get profile >>>", profile);
      const jsonStr = JSON.stringify(profile);
      window.localStorage.setItem("auth", jsonStr);
    },
    setIsLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setENT(state, ENT) {
      state.ENT = ENT;
      window.localStorage.setItem("ENT", ENT);
    },
    setLang(state, lang) {
      state.lang = lang;
      window.localStorage.setItem("lang", lang);
    },
    setLangList(state, langList) {
      state.langList = langList;
    },
    setSearchForm(state, searchForm) {
      state.searchForm = searchForm;
    },
    setIsSearch(state, isSearch) {
      state.isSearch = isSearch;
    },
    setDownloadList(state, downloadList) {
      state.downloadList = downloadList;
    },
    setNavbarList(state, navbarList) {
      state.navbarList = navbarList;
    },
    //add by ianlo007 PQC/CQCT300用,區分是否檢驗過。--S
    setStus(state, STUS) {
      state.STUS = STUS;
    },
    //add by ianlo007 PQC/CQCT300用,區分是否檢驗過。--E
    //20230328 add by ianlo007 用於CSFR337將array丟到ASFT337PDF。--S
    setSelectedList(state, selectedList) {
      state.selectedList = selectedList;
    },
    //20230328 add by ianlo007 用於CSFR337將array丟到ASFT337PDF。--E
    addDownloadListFile(state, fileData = {}) {
      const {
        func = () => {},
        type = "download",
        fileType = "xlsx",
      } = fileData;

      const index = state.downloadList.filter((o) => o.type === type).length;
      const temp = {
        ...fileData,
        id: uuidv4(),
        func,
        filename: `${type}-download-${index}.${fileType}`,
      };

      state.downloadList = [...state.downloadList, temp];
    },
    setSiteMode(state, siteMode) {
      state.siteMode = siteMode;
    },
    socket(state, socketState) {
      state.socketState = socketState;
    },
    addErrorMsg(state, errorObj) {
      state.errorMsgList = [
        ...state.errorMsgList,
        { ...errorObj, time: new Date() },
      ];
    },
    setIsMenuOpen(state, isMenuOpen) {
      state.isMenuOpen = isMenuOpen;
    },
  },
};
